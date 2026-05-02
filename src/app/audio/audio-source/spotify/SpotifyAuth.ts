export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface SpotifyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export class SpotifyAuth {
  private static instanceCounter = 0;
  private instanceId: number;

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private refreshTimer: number | null = null;
  private periodicCheckTimer: number | null = null;

  private authServerUrl = 'https://spotify-auth-tmusic.vercel.app';
  private onStateChange?: (state: SpotifyAuthState) => void;

  private static readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'spotify_access_token',
    REFRESH_TOKEN: 'spotify_refresh_token',
    TOKEN_EXPIRES_AT: 'spotify_token_expires_at',
    JUST_AUTHENTICATED: 'spotify_just_authenticated',
    PRE_AUTH_PATH: 'spotify_pre_auth_path',
  };

  constructor(onStateChange?: (state: SpotifyAuthState) => void) {
    this.instanceId = ++SpotifyAuth.instanceCounter;
    console.log(`🔐 SpotifyAuth instance #${this.instanceId} created`);
    this.onStateChange = onStateChange;
  }

  destroy(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
      this.periodicCheckTimer = null;
    }
    console.log(`🗑️  SpotifyAuth instance #${this.instanceId} destroyed`);
  }

  private updateState(updates: Partial<SpotifyAuthState>): void {
    if (this.onStateChange) {
      this.onStateChange({
        isAuthenticated: this.isAuthenticated(),
        isLoading: false,
        error: null,
        ...updates,
      });
    }
  }

  async authenticate(): Promise<boolean> {
    console.log(`🔐 [AuthInstance #${this.instanceId}] authenticate() called`);
    this.updateState({ isLoading: true });

    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresIn = params.get('expires_in');

      console.log('   - URL hash:', hash ? 'present' : 'empty');
      console.log('   - OAuth token in hash:', accessToken ? 'yes' : 'no');
      console.log('   - Stored token exists:', this.getStoredToken() ? 'yes' : 'no');

      if (accessToken) {
        console.log('🔑 New access token received from URL hash');
        this.storeTokens(accessToken, refreshToken, expiresIn);

        localStorage.setItem(SpotifyAuth.STORAGE_KEYS.JUST_AUTHENTICATED, 'true');

        const savedPath = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.PRE_AUTH_PATH);
        localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.PRE_AUTH_PATH);

        if (savedPath && savedPath !== '/') {
          console.log('🔙 Restoring pre-auth route:', savedPath);
          window.location.replace(window.location.origin + savedPath);
          return true;
        } else {
          window.history.replaceState(null, '', window.location.pathname);
        }

        this.updateState({ isLoading: false });
        console.log('✅ Authentication complete, flag set to show permission dialog');
        return true;
      }

      const storedToken = this.getStoredToken();
      const storedExpiresAt = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.TOKEN_EXPIRES_AT);

      if (storedToken) {
        console.log('📦 Found stored access token, using existing session');
        this.loadStoredTokens();

        if (storedExpiresAt) {
          const now = Date.now();
          const timeUntilExpiry = this.tokenExpiresAt! - now;
          const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
          const expiresAtDate = new Date(this.tokenExpiresAt!);
          console.log(
            `⏰ Stored token expires at ${expiresAtDate.toLocaleTimeString()} (in ${minutesUntilExpiry} minutes)`
          );

          if (this.tokenExpiresAt! <= now + 60000) {
            console.log('⚠️  Token expired or about to expire (< 1 minute remaining), refreshing immediately...');
            const refreshed = await this.refreshAccessToken();
            if (!refreshed) {
              console.log('❌ Token refresh failed, redirecting to re-auth');
              this.clearAuthData();
              window.location.href = this.getAuthUrl();
              return false;
            }
          } else {
            const expiresInSeconds = Math.floor(timeUntilExpiry / 1000);
            console.log(`✅ Token is valid, scheduling refresh`);
            this.scheduleTokenRefresh(expiresInSeconds);
          }
        }

        const hasValidScopes = await this.validateScopes();
        if (!hasValidScopes) {
          console.log('Stored token lacks required scopes, removing and redirecting to re-auth');
          this.clearAuthData();
          window.location.href = this.getAuthUrl();
          return false;
        }

        this.updateState({ isLoading: false });
        console.log('✅ Using existing stored token');
        return true;
      }

      console.log('🚪 No stored token found, redirecting to Spotify login...');
      const loginUrl = this.getAuthUrl();
      console.log('Redirecting to Spotify login with required scopes:', loginUrl);
      window.location.href = loginUrl;
      return false;
    } catch (error) {
      console.error('Spotify authentication failed:', error);
      this.updateState({
        isLoading: false,
        error: 'Spotify authentication failed: ' + (error as Error).message,
      });
      return false;
    }
  }

  async checkForAuthOnLoad(): Promise<boolean> {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      console.log('🔑 OAuth tokens detected in URL, authenticating...');
      const authenticated = await this.authenticate();
      if (authenticated) {
        console.log('✅ Authentication successful');
        return true;
      }
    }

    const justAuthenticated = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.JUST_AUTHENTICATED);
    if (justAuthenticated === 'true') {
      console.log('🎵 Just completed authentication after redirect, flag detected');
      console.log('💡 Loading token from localStorage for this instance...');

      this.loadStoredTokens();

      if (this.accessToken) {
        console.log(`✅ [AuthInstance #${this.instanceId}] Token loaded from localStorage after redirect`);
      } else {
        console.error('❌ Flag exists but no token in localStorage - this should not happen!');
      }

      return true;
    }

    return false;
  }

  private storeTokens(accessToken: string, refreshToken: string | null, expiresIn: string | null): void {
    this.accessToken = accessToken;
    localStorage.setItem(SpotifyAuth.STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    if (refreshToken) {
      console.log('🔄 Refresh token received and stored');
      this.refreshToken = refreshToken;
      localStorage.setItem(SpotifyAuth.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    if (expiresIn) {
      const expiresInNum = parseInt(expiresIn);
      this.tokenExpiresAt = Date.now() + expiresInNum * 1000;
      const expiresAtDate = new Date(this.tokenExpiresAt);
      console.log(`⏰ Token expires in ${expiresInNum} seconds (at ${expiresAtDate.toLocaleTimeString()})`);
      localStorage.setItem(SpotifyAuth.STORAGE_KEYS.TOKEN_EXPIRES_AT, this.tokenExpiresAt.toString());
      this.scheduleTokenRefresh(expiresInNum);
    }
  }

  private loadStoredTokens(): void {
    const storedToken = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.ACCESS_TOKEN);
    const storedRefreshToken = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.REFRESH_TOKEN);
    const storedExpiresAt = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.TOKEN_EXPIRES_AT);

    if (storedToken) {
      this.accessToken = storedToken;
      this.refreshToken = storedRefreshToken;

      if (storedExpiresAt) {
        this.tokenExpiresAt = parseInt(storedExpiresAt);
        const expiresInSeconds = Math.floor((this.tokenExpiresAt - Date.now()) / 1000);
        this.scheduleTokenRefresh(expiresInSeconds);
      }
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(SpotifyAuth.STORAGE_KEYS.ACCESS_TOKEN);
  }

  async validateScopes(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to validate token:', response.status, response.statusText);
        return false;
      }

      const userData = await response.json();
      console.log('Spotify user data:', userData);

      const testResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (testResponse.status === 401) {
        console.error('❌ Token missing required scopes for Web Playback SDK');
        console.error('Required scopes: user-read-playback-state, user-modify-playback-state, streaming');
        this.updateState({
          isLoading: false,
          error: 'Spotify token missing required permissions. Please re-authenticate with proper scopes.',
        });
        return false;
      }

      console.log('✓ Token validation successful');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async checkUserPremium(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Spotify user data:', userData);
        const isPremium = userData.product === 'premium';
        console.log('User has Spotify Premium:', isPremium);
        return isPremium;
      } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error checking user premium status:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.error('❌ No refresh token available');
      return false;
    }

    try {
      console.log('🔄 Requesting new access token from auth server...');
      const response = await fetch(
        `${this.authServerUrl}/refresh?refresh_token=${encodeURIComponent(this.refreshToken)}`
      );

      if (!response.ok) {
        console.error('❌ Token refresh failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return false;
      }

      const data = await response.json();
      console.log('📦 Received refresh response from server');

      if (data.access_token) {
        this.accessToken = data.access_token;
        localStorage.setItem(SpotifyAuth.STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
        console.log('✅ New access token stored');

        if (data.refresh_token) {
          this.refreshToken = data.refresh_token;
          localStorage.setItem(SpotifyAuth.STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
          console.log('✅ New refresh token stored');
        }

        if (data.expires_in) {
          this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
          const expiresAtDate = new Date(this.tokenExpiresAt);
          const expiresInMinutes = Math.floor(data.expires_in / 60);
          console.log(`⏰ New token expires in ${expiresInMinutes} minutes (at ${expiresAtDate.toLocaleTimeString()})`);
          localStorage.setItem(SpotifyAuth.STORAGE_KEYS.TOKEN_EXPIRES_AT, this.tokenExpiresAt.toString());
          this.scheduleTokenRefresh(data.expires_in);
        }

        console.log('✅ Access token refreshed successfully');
        return true;
      }

      console.error('❌ No access token in refresh response');
      return false;
    } catch (error) {
      console.error('❌ Error refreshing access token:', error);
      return false;
    }
  }

  private scheduleTokenRefresh(expiresInSeconds: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const refreshInSeconds = Math.max(0, expiresInSeconds - 300);
    const refreshInMinutes = Math.floor(refreshInSeconds / 60);
    const refreshAt = new Date(Date.now() + refreshInSeconds * 1000);
    console.log(`⏲️  Scheduling token refresh in ${refreshInMinutes} minutes (at ${refreshAt.toLocaleTimeString()})`);

    this.refreshTimer = setTimeout(async () => {
      console.log('🔄 Scheduled token refresh triggered');
      const success = await this.refreshAccessToken();
      if (!success) {
        console.error('❌ Scheduled token refresh failed, user may need to re-authenticate');
        this.updateState({
          error: 'Spotify session expired. Please re-authenticate.',
        });
      } else {
        console.log('✅ Scheduled token refresh successful');
      }
    }, refreshInSeconds * 1000);
  }

  startPeriodicTokenCheck(): void {
    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
    }

    console.log('🔍 Starting periodic token check (every 5 minutes)');

    this.periodicCheckTimer = setInterval(async () => {
      const now = Date.now();
      if (this.tokenExpiresAt) {
        const timeUntilExpiry = this.tokenExpiresAt - now;
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
        console.log(`🔍 Periodic token check: ${minutesUntilExpiry} minutes until expiry`);

        if (this.tokenExpiresAt <= now + 120000) {
          console.log('⚠️  Token about to expire (< 2 minutes), refreshing proactively...');
          const success = await this.refreshAccessToken();
          if (!success) {
            console.error('❌ Proactive token refresh failed');
            this.updateState({
              error: 'Spotify session expired. Please re-authenticate.',
            });
            if (this.periodicCheckTimer) {
              clearInterval(this.periodicCheckTimer);
              this.periodicCheckTimer = null;
              console.log('🛑 Stopped periodic token check due to refresh failure');
            }
          }
        } else {
          console.log('✅ Token still valid, no refresh needed');
        }
      }
    }, 5 * 60 * 1000);
  }

  clearJustAuthenticatedFlag(): void {
    const justAuthenticated = localStorage.getItem(SpotifyAuth.STORAGE_KEYS.JUST_AUTHENTICATED);
    if (justAuthenticated === 'true') {
      localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.JUST_AUTHENTICATED);
      console.log('🧹 Cleared spotify_just_authenticated flag after successful playback start');
    }
  }

  clearAuthData(): void {
    console.log('🧹 Clearing all authentication data');
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
      console.log('🛑 Cleared scheduled token refresh');
    }

    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
      this.periodicCheckTimer = null;
      console.log('🛑 Stopped periodic token check');
    }

    localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.TOKEN_EXPIRES_AT);
    localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.JUST_AUTHENTICATED);
    localStorage.removeItem(SpotifyAuth.STORAGE_KEYS.PRE_AUTH_PATH);
    console.log('🧹 Cleared localStorage tokens and flags');

    this.updateState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }

  getAuthUrl(): string {
    const currentPath = window.location.pathname;
    const basePath = (process.env.PUBLIC_PATH || '/').replace(/\/$/, '');
    const isRootPath = currentPath === basePath || currentPath === basePath + '/';

    if (!isRootPath) {
      console.log('💾 Saving current route before auth:', currentPath);
      localStorage.setItem(SpotifyAuth.STORAGE_KEYS.PRE_AUTH_PATH, currentPath);
    }

    const redirectUrl = process.env.IS_EXTENSION
      ? window.location.origin + '/index.html'
      : window.location.href.split('#')[0].replace(/\/$/, '');
    let authUrl = `${this.authServerUrl}/login?origin=${encodeURIComponent(redirectUrl)}`;
    authUrl += `&scopes=user-read-playback-state,user-modify-playback-state,streaming`;

    console.log('🔗 Auth URL:', authUrl);
    console.log('📋 Redirect URL:', redirectUrl);
    console.log('📋 Requested scopes:', 'user-read-playback-state,user-modify-playback-state,streaming');
    return authUrl;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getState(): SpotifyAuthState {
    return {
      isAuthenticated: this.isAuthenticated(),
      isLoading: false,
      error: null,
    };
  }

  getTokens(): SpotifyTokens | null {
    if (!this.accessToken) {
      return null;
    }

    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: this.tokenExpiresAt,
    };
  }

  async ensureValidToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    const now = Date.now();
    if (this.tokenExpiresAt && this.tokenExpiresAt <= now + 60000) {
      console.log('⚠️  Token expires in < 1 minute, refreshing before use...');
      return await this.refreshAccessToken();
    }

    return true;
  }
}
