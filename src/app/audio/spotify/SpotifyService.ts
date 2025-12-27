export interface SpotifyState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentTrack: any | null;
  error: string | null;
}

export class SpotifyService {
  private accessToken: string | null = null;
  private authServerUrl = 'https://spotify-auth-tmusic.vercel.app';
  private player: any = null;
  private deviceId: string | null = null;
  private currentTrack: any = null;
  private isLoading: boolean = false;
  private onStateChange?: (state: SpotifyState) => void;
  private onPlaybackStart?: () => void;

  constructor(onStateChange?: (state: SpotifyState) => void, onPlaybackStart?: () => void) {
    this.onStateChange = onStateChange;
    this.onPlaybackStart = onPlaybackStart;
  }

  private updateState(updates: Partial<SpotifyState>) {
    if (this.onStateChange) {
      this.onStateChange({
        isAuthenticated: this.isAuthenticated(),
        isLoading: this.isLoading,
        currentTrack: this.currentTrack,
        error: null,
        ...updates,
      });
    }
  }

  async authenticate(): Promise<boolean> {
    this.isLoading = true;
    this.updateState({ isLoading: true });

    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        this.accessToken = accessToken;
        localStorage.setItem('spotify_access_token', accessToken);
        window.location.hash = '';
        this.isLoading = false;
        this.updateState({ isLoading: false });
        return true;
      }

      const storedToken = localStorage.getItem('spotify_access_token');
      if (storedToken) {
        this.accessToken = storedToken;

        // Validate the stored token has required scopes
        const hasValidScopes = await this.validateScopes();
        if (!hasValidScopes) {
          console.log('Stored token lacks required scopes, removing and redirecting to re-auth');
          this.clearAuthData();
          // Redirect to login with proper scopes
          window.location.href = this.getAuthUrl();
          return false;
        }

        this.isLoading = false;
        this.updateState({ isLoading: false });
        return true;
      }

      const loginUrl = this.getAuthUrl();
      console.log('Redirecting to Spotify login with required scopes:', loginUrl);
      window.location.href = loginUrl;
      return false;
    } catch (error) {
      console.error('Spotify authentication failed:', error);
      this.isLoading = false;
      this.updateState({ isLoading: false, error: 'Spotify authentication failed: ' + (error as Error).message });
      return false;
    }
  }

  async checkForAuthOnLoad(): Promise<boolean> {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      const authenticated = await this.authenticate();
      if (authenticated) {
        await this.playAlbumAndGetCurrentTrack();
        return true;
      }
    }
    return false;
  }

  async playAlbumAndGetCurrentTrack(spotifyUri?: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Spotify');
    }

    this.isLoading = true;
    this.updateState({ isLoading: true });
    console.log('Starting Spotify playback...');

    const hasValidScopes = await this.validateScopes();
    if (!hasValidScopes) {
      this.isLoading = false;
      this.updateState({ isLoading: false });
      throw new Error('Spotify authentication lacks required permissions. Please re-authenticate.');
    }

    try {
      if (!this.player) {
        console.log('Initializing Spotify Web Playback...');
        await this.initializeWebPlayback();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (!this.deviceId) {
        console.error('Spotify device not ready after initialization');
        this.isLoading = false;
        this.updateState({ isLoading: false, error: 'Spotify device not ready. Please try again in a moment.' });
        throw new Error('Spotify device not ready. Please try again in a moment.');
      }

      console.log('Spotify device ready, device ID:', this.deviceId);

      const albumUri = spotifyUri || 'spotify:album:5Dgqy4bBg09Rdw7CQM545s';
      console.log('Using album URI:', albumUri);

      const albumId = albumUri.split(':')[2];

      console.log('Setting active device...');
      const deviceResponse = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: [this.deviceId],
          play: false,
        }),
      });

      if (!deviceResponse.ok) {
        console.error('Failed to set active device:', deviceResponse.status, deviceResponse.statusText);
        const errorText = await deviceResponse.text();
        console.error('Device error response:', errorText);
      } else {
        console.log('Active device set successfully');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Starting album playback for album ID:', albumId);
      const playResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context_uri: albumUri,
          device_id: this.deviceId,
        }),
      });

      if (!playResponse.ok) {
        console.error('Failed to start playback:', playResponse.status, playResponse.statusText);
        const errorText = await playResponse.text();
        console.error('Playback error response:', errorText);
        this.isLoading = false;
        this.updateState({
          isLoading: false,
          error: `Failed to play album: ${playResponse.status} ${playResponse.statusText}`,
        });
        throw new Error(`Failed to play album: ${playResponse.status} ${playResponse.statusText}`);
      }

      console.log('Playback started successfully');

      // Notify that playback has started
      if (this.onPlaybackStart) {
        this.onPlaybackStart();
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      const currentResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        if (currentData && currentData.item) {
          this.currentTrack = {
            ...currentData.item,
            is_playing: currentData.is_playing,
            progress_ms: currentData.progress_ms,
          };
          this.isLoading = false;
          this.updateState({ isLoading: false, currentTrack: this.currentTrack });
          return this.currentTrack;
        }
      }

      const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (albumResponse.ok) {
        const albumData = await albumResponse.json();
        if (albumData.tracks?.items?.[0]) {
          this.currentTrack = albumData.tracks.items[0];
          this.isLoading = false;
          this.updateState({ isLoading: false, currentTrack: this.currentTrack });
          return this.currentTrack;
        }
      }

      this.isLoading = false;
      this.updateState({ isLoading: false, error: 'Could not get track information' });
      throw new Error('Could not get track information');
    } catch (error) {
      console.error('Failed to play album and get track:', error);
      this.isLoading = false;
      this.updateState({ isLoading: false, error: 'Failed to play album and get track: ' + (error as Error).message });
      throw error;
    }
  }

  async initializeWebPlayback(): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Spotify');
    }

    return new Promise((resolve, reject) => {
      if (!(window as any).Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);

        (window as any).onSpotifyWebPlaybackSDKReady = () => {
          this.setupPlayer().then(resolve).catch(reject);
        };
      } else {
        this.setupPlayer().then(resolve).catch(reject);
      }
    });
  }

  private async setupPlayer(): Promise<boolean> {
    console.log('Setting up Spotify player...');
    const SpotifyPlayer = (window as any).Spotify.Player;

    this.player = new SpotifyPlayer({
      name: 'TMusic Web Player',
      getOAuthToken: (cb: (token: string) => void) => {
        console.log('Spotify requesting OAuth token');
        cb(this.accessToken!);
      },
      volume: 0.8,
      enableMediaSession: true,
    });

    // Error handling
    this.player.addListener('initialization_error', ({ message }: any) => {
      console.error('Spotify Player initialization error:', message);
    });

    this.player.addListener('authentication_error', ({ message }: any) => {
      console.error('Spotify Player authentication error:', message);
    });

    this.player.addListener('account_error', ({ message }: any) => {
      console.error('Spotify Player account error:', message);
    });

    this.player.addListener('playback_error', ({ message }: any) => {
      console.error('Spotify Player playback error:', message);
    });

    this.player.addListener('ready', ({ device_id }: any) => {
      console.log('Spotify Player ready with device ID:', device_id);
      this.deviceId = device_id;
    });

    this.player.addListener('not_ready', ({ device_id }: any) => {
      console.log('Spotify Player not ready with device ID:', device_id);
    });

    this.player.addListener('player_state_changed', (state: any) => {
      console.log('Spotify player state changed:', state);
    });

    console.log('Connecting Spotify player...');
    const success = await this.player.connect();
    console.log('Spotify player connected:', success);
    return success;
  }

  async stopPlayback(): Promise<void> {
    if (this.player) {
      try {
        await this.player.pause();
        console.log('Spotify playback stopped');
        this.currentTrack = null;
        this.updateState({ currentTrack: null });
      } catch (error) {
        console.error('Error stopping Spotify playback:', error);
        this.updateState({ error: 'Error stopping Spotify playback: ' + (error as Error).message });
      }
    }
  }

  getCurrentTrackDisplay(): string {
    if (!this.currentTrack) return '';
    return `${this.currentTrack.name} by ${
      this.currentTrack.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist'
    }`;
  }

  getState(): SpotifyState {
    return {
      isAuthenticated: this.isAuthenticated(),
      isLoading: this.isLoading,
      currentTrack: this.currentTrack,
      error: null,
    };
  }

  async validateScopes(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      // Check token info to see what scopes we have
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

      // Try a test call that requires streaming scope
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

  clearAuthData(): void {
    this.accessToken = null;
    localStorage.removeItem('spotify_access_token');
    this.updateState({
      isAuthenticated: false,
      isLoading: false,
      currentTrack: null,
      error: null,
    });
  }

  getAuthUrl(): string {
    const currentOrigin = window.location.origin;
    // Make sure the auth server requests the required scopes
    return `${this.authServerUrl}/login?origin=${encodeURIComponent(
      currentOrigin
    )}&scopes=user-read-playback-state,user-modify-playback-state,streaming`;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }
}
