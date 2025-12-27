import { useState, useEffect } from 'react';
import { SpotifyService, SpotifyState } from './SpotifyService';
import { IconToggleButton } from '../../ui/icon-button/IconToggleButton';
import { FaSpotify } from 'react-icons/fa';
import { PiStop } from 'react-icons/pi';
import { SpotifyPermissionDialog } from './SpotifyPermissionDialog';
import { AudioProps } from '../AudioProps';

interface SpotifyAudioProps extends AudioProps {
  onError: (error: string) => void;
}

export const SpotifyAudio = ({ isActive, onStreamCreated, onError }: SpotifyAudioProps) => {
  const [spotifyService] = useState(() => new SpotifyService(state => setSpotifyState(state)));
  const [spotifyState, setSpotifyState] = useState<SpotifyState>(() => spotifyService.getState());
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [activeStreams, setActiveStreams] = useState<{
    systemStream?: MediaStream;
    audioContext?: AudioContext;
  }>({});

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      try {
        await spotifyService.checkForAuthOnLoad();
      } catch (error) {
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

  const handleSpotifyLogin = async () => {
    try {
      const authenticated = await spotifyService.authenticate();
      if (authenticated) {
        setShowDialog(true);
      }
    } catch (error) {
      onError('Spotify login failed: ' + (error as Error).message);
    }
  };

  const handleDialogConfirm = async () => {
    setShowDialog(false);
    try {
      await startScreenCapture();
      await spotifyService.playAlbumAndGetCurrentTrack();
    } catch (error) {
      onError('Failed to start Spotify recording: ' + (error as Error).message);
    }
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
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
    return 'Play Spotify + Record (Will ask for screen sharing to capture audio)';
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
