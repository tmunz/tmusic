import { SpotifyAuth, SpotifyAuthState } from './SpotifyAuth';

export interface SpotifyState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentTrack: any | null;
  error: string | null;
}

export class SpotifyService {
  private static instanceCounter = 0;

  private auth: SpotifyAuth;
  private player: any = null;
  private deviceId: string | null = null;
  private currentTrack: any = null;
  private isLoading: boolean = false;
  private onStateChange?: (state: SpotifyState) => void;
  private onPlaybackStart?: () => void;

  constructor(onStateChange?: (state: SpotifyState) => void, onPlaybackStart?: () => void) {
    SpotifyService.instanceCounter++;
    this.onStateChange = onStateChange;
    this.onPlaybackStart = onPlaybackStart;

    this.auth = new SpotifyAuth((authState: SpotifyAuthState) => {
      this.updateState({
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        error: authState.error,
      });
    });
  }

  destroy(): void {
    this.auth.destroy();

    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
  }

  private updateState(updates: Partial<SpotifyState>) {
    if (this.onStateChange) {
      this.onStateChange({
        isAuthenticated: this.auth.isAuthenticated(),
        isLoading: this.isLoading,
        currentTrack: this.currentTrack,
        error: null,
        ...updates,
      });
    }
  }

  async authenticate(): Promise<boolean> {
    return await this.auth.authenticate();
  }

  async checkForAuthOnLoad(): Promise<boolean> {
    return await this.auth.checkForAuthOnLoad();
  }

  async playAlbumAndGetCurrentTrack(spotifyUri?: string): Promise<any> {
    const accessToken = this.auth.getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated with Spotify');
    }

    this.isLoading = true;
    this.updateState({ isLoading: true });

    const hasValidScopes = await this.auth.validateScopes();
    if (!hasValidScopes) {
      this.isLoading = false;
      this.updateState({ isLoading: false });
      throw new Error('Spotify authentication lacks required permissions. Please re-authenticate.');
    }

    try {
      if (!this.player) {
        await this.initializeWebPlayback();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!this.deviceId) {
        this.isLoading = false;
        this.updateState({ isLoading: false, error: 'Spotify device not ready. Please try again in a moment.' });
        throw new Error('Spotify device not ready. Please try again in a moment.');
      }

      const albumUri = spotifyUri || 'spotify:album:5Dgqy4bBg09Rdw7CQM545s';
      const albumId = albumUri.split(':')[2];

      const deviceResponse = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: [this.deviceId],
          play: false,
        }),
      });

      if (!deviceResponse.ok) {
        const errorText = await deviceResponse.text();
        console.error('Failed to set active device:', deviceResponse.status, deviceResponse.statusText, errorText);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const playResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context_uri: albumUri,
          device_id: this.deviceId,
        }),
      });

      if (!playResponse.ok) {
        const errorText = await playResponse.text();
        console.error('Failed to start playback:', playResponse.status, playResponse.statusText, errorText);
        this.isLoading = false;
        this.updateState({
          isLoading: false,
          error: `Failed to play album: ${playResponse.status} ${playResponse.statusText}`,
        });
        throw new Error(`Failed to play album: ${playResponse.status} ${playResponse.statusText}`);
      }

      this.auth.clearJustAuthenticatedFlag();

      if (this.onPlaybackStart) {
        this.onPlaybackStart();
      }

      this.auth.startPeriodicTokenCheck();

      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
          Authorization: `Bearer ${accessToken}`,
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
    const accessToken = this.auth.getAccessToken();
    if (!accessToken) {
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
    const SpotifyPlayer = (window as any).Spotify.Player;

    this.player = new SpotifyPlayer({
      name: 'TMusic Web Player',
      getOAuthToken: async (cb: (token: string) => void) => {
        const isValid = await this.auth.ensureValidToken();
        if (!isValid) {
          this.updateState({
            error: 'Spotify session expired. Please re-authenticate.',
          });
        }

        const accessToken = this.auth.getAccessToken();
        cb(accessToken!);
      },
      volume: 0.8,
      enableMediaSession: true,
    });

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
      this.deviceId = device_id;
    });

    this.player.addListener('not_ready', ({ device_id }: any) => {
      console.error('Spotify Player not ready:', device_id);
    });

    this.player.addListener('player_state_changed', (state: any) => {
      if (state) {
        console.log('Spotify player state changed');
      }
    });

    const success = await this.player.connect();
    return success;
  }

  async stopPlayback(): Promise<void> {
    if (this.player) {
      try {
        await this.player.pause();
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
      isAuthenticated: this.auth.isAuthenticated(),
      isLoading: this.isLoading,
      currentTrack: this.currentTrack,
      error: null,
    };
  }

  async validateScopes(): Promise<boolean> {
    return await this.auth.validateScopes();
  }

  async checkUserPremium(): Promise<boolean> {
    return await this.auth.checkUserPremium();
  }

  clearAuthData(): void {
    this.auth.clearAuthData();
    this.updateState({
      isAuthenticated: false,
      isLoading: false,
      currentTrack: null,
      error: null,
    });
  }

  getAuthUrl(): string {
    return this.auth.getAuthUrl();
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}
