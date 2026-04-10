import './Audio.css';
import { useState } from 'react';
import { AudioSourceType } from './audio-source/AudioSourceType';
import { MicrophoneAudio } from './audio-source/microphone/MicrophoneAudio';
import { FileAudio } from './audio-source/file/FileAudio';
import { SpotifyAudio } from './audio-source/spotify/SpotifyAudio';
import { UrlStreamAudio } from './audio-source/url-stream/UrlStreamAudio';
import { BrowserTabAudio } from './audio-source/browser-tab/BrowserTabAudio';

interface AudioProviderProps {
  onChange: (stream: Promise<MediaStream | null>) => void;
}

export const Audio = ({ onChange }: AudioProviderProps) => {
  const [currentStream, setCurrentStream] = useState<{
    stream: MediaStream;
    type: AudioSourceType;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStreamCreated = (type: AudioSourceType) => (stream: MediaStream | null) => {
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
        <div className="audio-error">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <BrowserTabAudio
        isActive={currentStream?.type === AudioSourceType.BROWSER_TAB}
        onStreamCreated={handleStreamCreated(AudioSourceType.BROWSER_TAB)}
      />

      <MicrophoneAudio
        isActive={currentStream?.type === AudioSourceType.MICROPHONE}
        onStreamCreated={handleStreamCreated(AudioSourceType.MICROPHONE)}
      />

      <FileAudio
        isActive={currentStream?.type === AudioSourceType.FILE}
        onStreamCreated={handleStreamCreated(AudioSourceType.FILE)}
      />

      <SpotifyAudio
        isActive={currentStream?.type === AudioSourceType.SPOTIFY}
        onStreamCreated={handleStreamCreated(AudioSourceType.SPOTIFY)}
        onError={setError}
      />

      <UrlStreamAudio
        isActive={currentStream?.type === AudioSourceType.URI}
        onStreamCreated={handleStreamCreated(AudioSourceType.URI)}
      />
    </div>
  );
};
