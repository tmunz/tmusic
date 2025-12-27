import { useState, useEffect } from 'react';
import { PiRecordDuotone, PiRecordFill } from 'react-icons/pi';
import { IconToggleButton } from '../../ui/icon-button/IconToggleButton';
import { AudioProps } from '../AudioProps';

export const MicrophoneAudio = ({ isActive, onStreamCreated }: AudioProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive && stream) {
      stopRecording();
    }
  }, [isActive]);

  const startRecording = async () => {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(micStream);
      setIsRecording(true);
      onStreamCreated?.(micStream);
    } catch (error) {
      console.error('Failed to access microphone:', error);
      onStreamCreated?.(null);
    }
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
    onStreamCreated?.(null);
  };

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <IconToggleButton
      activeIcon={PiRecordFill}
      inactiveIcon={PiRecordDuotone}
      isActive={isRecording}
      onClick={handleToggle}
      className="recording"
      title={isRecording ? 'Stop recording' : 'Start recording'}
    />
  );
};
