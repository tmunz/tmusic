import './Audio.css';
import { useState } from 'react';
import { MediaStreamType } from './MediaStreamType';
import { MicrophoneAudio } from './microphone/MicrophoneAudio';
import { FileAudio } from './file/FileAudio';
import { SpotifyAudio } from './spotify/SpotifyAudio';
import { UrlStreamAudio } from './url-stream/UrlStreamAudio';

interface AudioProviderProps {
  onChange: (stream: Promise<MediaStream | null>) => void;
}

export const Audio = ({ onChange }: AudioProviderProps) => {
  const [currentStream, setCurrentStream] = useState<{
    stream: MediaStream;
    type: MediaStreamType;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStreamCreated = (type: MediaStreamType) => (stream: MediaStream | null) => {
    if (stream) {
      if (currentStream?.stream && currentStream.type !== type) {
        currentStream.stream.getTracks().forEach(track => track.stop());
      }
      setCurrentStream({ stream, type });
      onChange(Promise.resolve(stream));
      setError(null);
    } else {
      if (currentStream?.type === type) {
        setCurrentStream(null);
        onChange(Promise.resolve(null));
      }
    }
  };

  return (
    <div className="audio">
      {error && (
        <div
          className="audio-error"
          style={{
            background: '#ff4444',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '0.9em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}

      <MicrophoneAudio
        isActive={currentStream?.type === MediaStreamType.MICROPHONE}
        onStreamCreated={handleStreamCreated(MediaStreamType.MICROPHONE)}
      />

      <FileAudio
        isActive={currentStream?.type === MediaStreamType.FILE}
        onStreamCreated={handleStreamCreated(MediaStreamType.FILE)}
      />

      <SpotifyAudio
        isActive={currentStream?.type === MediaStreamType.SPOTIFY}
        onStreamCreated={handleStreamCreated(MediaStreamType.SPOTIFY)}
        onError={setError}
      />

      <UrlStreamAudio
        isActive={currentStream?.type === MediaStreamType.URI}
        onStreamCreated={handleStreamCreated(MediaStreamType.URI)}
      />
    </div>
  );
};
