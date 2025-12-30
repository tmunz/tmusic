import { useState, useEffect } from 'react';
import { SpotifyService, SpotifyState } from './SpotifyService';
import { IconToggleButton } from '../../ui/icon-button/IconToggleButton';
import { FaSpotify } from 'react-icons/fa';
import { PiStop } from 'react-icons/pi';
import { SpotifyPermissionDialog } from './SpotifyPermissionDialog';
import { AudioProps } from '../AudioProps';
import { useAppState } from '../../AppContext';

interface SpotifyAudioProps extends AudioProps {
  onError: (error: string) => void;
}

export const SpotifyAudio = ({ isActive, onStreamCreated, onError }: SpotifyAudioProps) => {
  const { appState } = useAppState();
  const [spotifyService] = useState(() => {
    const service = new SpotifyService(state => setSpotifyState(state));
    console.log('📦 SpotifyAudio: Created SpotifyService instance');
    return service;
  });
  const [spotifyState, setSpotifyState] = useState<SpotifyState>(() => spotifyService.getState());
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [activeStreams, setActiveStreams] = useState<{
    systemStream?: MediaStream;
    audioContext?: AudioContext;
  }>({});

  // Log dialog state changes
  useEffect(() => {
    console.log('🎭 Dialog state changed:', showDialog ? 'SHOWING' : 'HIDDEN');
  }, [showDialog]);

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      try {
        console.log('🔍 SpotifyAudio: Checking for auth on component mount...');
        const wasAuthenticating = await spotifyService.checkForAuthOnLoad();
        console.log('🔍 SpotifyAudio: checkForAuthOnLoad returned:', wasAuthenticating);
        if (wasAuthenticating) {
          // User just completed authentication, show the dialog to start playback
          console.log('🎵 User authenticated, showing permission dialog');
          setShowDialog(true);
        } else {
          console.log('ℹ️  No authentication detected, dialog will not show');
        }
      } catch (error) {
        console.error('❌ Error checking Spotify authentication:', error);
        onError('Failed to check Spotify authentication: ' + (error as Error).message);
      }
    };
    checkAuthOnLoad();
  }, []);

  useEffect(() => {
    if (spotifyState.error) {
      onError(spotifyState.error);
    }
  }, [spotifyState.error, onError]);

  useEffect(() => {
    if (!isActive && spotifyState.currentTrack) {
      handleSpotifyStop().catch(console.error);
    }
  }, [isActive]);

  useEffect(() => {
    if (spotifyState.currentTrack && appState.visualization?.spotifyUri) {
      spotifyService.playAlbumAndGetCurrentTrack(appState.visualization.spotifyUri).catch(error => {
        onError('Failed to switch album: ' + (error as Error).message);
      });
    }
  }, [appState.visualization?.spotifyUri]);

  const handleSpotifyLogin = async () => {
    console.log('🎵 Spotify button clicked');
    try {
      const authenticated = await spotifyService.authenticate();
      console.log('🔐 Authentication result:', authenticated);
      if (authenticated) {
        // User is authenticated (either just now or has existing token)
        // Always show the dialog to get screen share permission
        console.log('✅ User authenticated, showing permission dialog');
        setShowDialog(true);
      }
    } catch (error) {
      console.error('❌ Spotify login failed:', error);
      onError('Spotify login failed: ' + (error as Error).message);
    }
  };

  const handleDialogConfirm = async () => {
    console.log('✅ User confirmed permission dialog, starting screen capture...');
    setShowDialog(false);
    try {
      await startScreenCapture();
      console.log('✅ Screen capture successful, starting playback...');
      await spotifyService.playAlbumAndGetCurrentTrack(appState.visualization?.spotifyUri);
    } catch (error) {
      console.error('❌ Error in handleDialogConfirm:', error);
      onError('Failed to start Spotify recording: ' + (error as Error).message);
    }
  };

  const handleDialogCancel = () => {
    console.log('❌ User cancelled permission dialog');
    setShowDialog(false);
    // Clear the authentication flag since user cancelled
    localStorage.removeItem('spotify_just_authenticated');
    console.log('🧹 Cleared spotify_just_authenticated flag after user cancellation');
    onError('Screen sharing is required to capture Spotify audio. Please try again when ready.');
  };

  const startScreenCapture = async () => {
    try {
      console.log('Attempting to capture system audio...');

      let systemStream;
      try {
        systemStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            frameRate: { ideal: 5, max: 10 },
          },
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100,
          },
          preferCurrentTab: true,
        });
      } catch (videoError) {
        systemStream = await (navigator.mediaDevices as any).getDisplayMedia({
          audio: true,
          video: {
            width: 320,
            height: 240,
            frameRate: 1,
          },
        });
      }

      const audioTracks = systemStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio track found. Please make sure to check "Share audio" when sharing your screen.');
      }

      const audioContext = new AudioContext();
      const systemSource = audioContext.createMediaStreamSource(systemStream);
      const destination = audioContext.createMediaStreamDestination();

      systemSource.connect(destination);

      const capturedStream = destination.stream;

      setActiveStreams({
        systemStream,
        audioContext,
      });

      onStreamCreated?.(capturedStream);

      console.log('✓ System audio captured successfully');
    } catch (e) {
      let errorMessage = 'System audio capture failed.';
      if (e instanceof Error) {
        if (e.message.includes('audio track')) {
          errorMessage =
            '⚠️ No audio shared! Please try again and make sure to check "Share audio" in the screen share dialog.';
        } else if (e.name === 'NotAllowedError') {
          errorMessage = '⚠️ Screen sharing denied. Please try again and allow screen sharing with audio.';
        } else if (e.message.includes('Timeout')) {
          errorMessage =
            '⏱️ Screen sharing timed out. Try again and share a specific browser tab instead of the entire screen.';
        } else {
          errorMessage = `System audio error: ${e.message}`;
        }
      }

      onError(errorMessage);

      await spotifyService.stopPlayback();
    }
  };

  const handleSpotifyStop = async () => {
    try {
      await spotifyService.stopPlayback();

      if (activeStreams.systemStream) {
        activeStreams.systemStream.getTracks().forEach(track => track.stop());
      }

      if (activeStreams.audioContext) {
        await activeStreams.audioContext.close();
      }

      setActiveStreams({});
      onStreamCreated?.(null);

      console.log('Spotify stopped successfully');
    } catch (error) {
      onError('Failed to stop Spotify: ' + (error as Error).message);
    }
  };

  const getButtonTitle = () => {
    if (spotifyState.currentTrack) {
      return spotifyService.getCurrentTrackDisplay();
    }
    if (spotifyState.isLoading) {
      return 'Loading...';
    }
    return 'Play Spotify (Will ask for screen sharing to capture audio)';
  };

  return (
    <>
      <IconToggleButton
        activeIcon={PiStop}
        inactiveIcon={FaSpotify}
        isActive={!!spotifyState.currentTrack}
        onClick={spotifyState.currentTrack ? handleSpotifyStop : handleSpotifyLogin}
        title={getButtonTitle()}
      />

      <SpotifyPermissionDialog isOpen={showDialog} onConfirm={handleDialogConfirm} onCancel={handleDialogCancel} />
    </>
  );
};
