import './UrlStreamAudio.css';
import { useState, useEffect } from 'react';
import { PiPlay, PiStop } from 'react-icons/pi';
import { IconToggleButton } from '../../ui/icon-button/IconToggleButton';
import { AudioProps } from '../AudioProps';
import { createAudioStream, cleanupAudioStream } from '../AudioStream';
import { Input } from '../../ui/input/Input';

export const UrlStreamAudio = ({ isActive, onStreamCreated }: AudioProps) => {
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string>('https://rautemusik.stream25.radiohost.de/rm-80s_mp3-192');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive && (audioPlayer || isPlaying)) {
      stopAudio();
    }
  }, [isActive]);

  useEffect(() => {
    if (url.trim() && !audioPlayer && isPlaying) {
      startAudio();
    }
  }, [url, audioPlayer, isPlaying]);

  const startAudio = async () => {
    if (!url.trim()) return;

    try {
      const { stream, audio } = await createAudioStream(url);
      setAudioPlayer(audio);
      await audio.play();

      onStreamCreated?.(stream);
    } catch (error) {
      console.error('Failed to create audio stream:', error);
      setIsPlaying(false);
      onStreamCreated?.(null);
    }
  };

  const stopAudio = () => {
    if (audioPlayer) {
      cleanupAudioStream(audioPlayer);
      setAudioPlayer(null);
    }
    setIsPlaying(false);
    onStreamCreated?.(null);
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopAudio();
    } else if (url.trim()) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="url-stream">
      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter audio URL..." disabled={isPlaying} />
      <IconToggleButton
        activeIcon={PiStop}
        inactiveIcon={PiPlay}
        isActive={isPlaying}
        onClick={handleToggle}
        title={isPlaying ? 'Stop' : 'Play'}
      />
    </div>
  );
};

UrlStreamAudio.displayName = 'UrlStreamAudio';
