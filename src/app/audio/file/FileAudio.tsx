import { useRef, useState, useEffect } from 'react';
import { PiStop, PiUpload } from 'react-icons/pi';
import { IconToggleButton } from '../../ui/icon-button/IconToggleButton';
import { createAudioStream, cleanupAudioStream } from '../AudioStream';
import { AudioProps } from '../AudioProps';

export const FileAudio = ({ isActive, onStreamCreated }: AudioProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive && (audioPlayer || isPlaying)) {
      stopAudio();
    }
  }, [isActive]);

  useEffect(() => {
    if (selectedFile && !audioPlayer && isPlaying) {
      startAudio();
    }
  }, [selectedFile, audioPlayer, isPlaying]);

  const startAudio = async () => {
    if (!selectedFile) return;

    try {
      const fileUrl = URL.createObjectURL(selectedFile);
      setObjectUrl(fileUrl);

      const { stream, audio } = await createAudioStream(fileUrl, true);
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
      cleanupAudioStream(audioPlayer, objectUrl || undefined);
      setAudioPlayer(null);
    }
    setObjectUrl(null);
    setFileName('');
    setIsPlaying(false);
    onStreamCreated?.(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setIsPlaying(true);
    }
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      handleUploadClick();
    }
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileChange} />
      <IconToggleButton
        activeIcon={PiStop}
        inactiveIcon={PiUpload}
        isActive={isPlaying}
        onClick={handleToggle}
        title={fileName || 'Upload Audio File'}
      />
    </>
  );
};

FileAudio.displayName = 'FileAudio';
