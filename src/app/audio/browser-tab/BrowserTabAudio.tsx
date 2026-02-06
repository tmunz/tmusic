import { useState, useEffect } from 'react';
import { PiBrowser, PiStop } from 'react-icons/pi';
import { IconToggleButton } from '../../ui/icon-button/IconToggleButton';
import { AudioProps } from '../AudioProps';

export const BrowserTabAudio = ({ isActive, onStreamCreated }: AudioProps) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  useEffect(() => {
    const checkExtension = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
          setIsAvailable(true);
        }
      } catch (e) {
        setIsAvailable(false);
      }
    };
    checkExtension();
  }, []);

  useEffect(() => {
    if (!isActive && audioPlayer) {
      stopAudio();
    }
  }, [isActive]);

  // Auto-start once when first available
  useEffect(() => {
    if (isAvailable && !hasAutoStarted) {
      setHasAutoStarted(true);
      startAudio();
    }
  }, [isAvailable, hasAutoStarted]);

  const startAudio = async () => {
    if (!isAvailable) {
      setError('Browser tab audio is only available when running as a Chrome extension');

      return;
    }

    try {
      const sourceTabId = (await chrome.storage.session.get(['sourceTabId'])).sourceTabId;
      if (!sourceTabId) {
        setError(
          'No source tab specified. Please open the tab playing audio and then reopen tmusic from the extension icon.'
        );
        return;
      }

      const tabId = sourceTabId;
      const streamId = await new Promise<string | undefined>(resolve => {
        (chrome as any).tabCapture.getMediaStreamId({ targetTabId: tabId }, (streamId: string) => {
          if (chrome.runtime.lastError) {
            console.error('Stream ID error:', chrome.runtime.lastError);
            resolve(undefined);
          } else {
            resolve(streamId);
          }
        });
      });

      if (!streamId) {
        setError('Could not get stream from tab. Make sure the tab has audio playing.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // @ts-ignore
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: streamId,
          },
        },
        video: false,
      });

      if (stream) {
        const audio = new Audio();
        audio.srcObject = stream;

        // Wait for audio to be ready before notifying
        await new Promise<void>(resolve => {
          audio.addEventListener('canplay', () => resolve(), { once: true });
          audio.play();
        });

        // Give the audio context a moment to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        setAudioPlayer(audio);
        onStreamCreated?.(stream);
        setError(null);
      } else {
        setError('Failed to capture audio. Make sure the source tab has audio playing.');
        onStreamCreated?.(null);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      onStreamCreated?.(null);
    }
  };

  const stopAudio = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      const stream = audioPlayer.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      audioPlayer.srcObject = null;
      setAudioPlayer(null);
    }
    onStreamCreated?.(null);
    setError(null);
  };

  const handleToggle = () => {
    if (isActive) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <>
      <IconToggleButton
        activeIcon={PiStop}
        inactiveIcon={PiBrowser}
        isActive={isActive}
        onClick={handleToggle}
        title={isActive ? 'Stop browser tab audio' : 'Play browser tab audio'}
      />
      {error && <div className="audio-error">{error}</div>}
    </>
  );
};

BrowserTabAudio.displayName = 'BrowserTabAudio';
