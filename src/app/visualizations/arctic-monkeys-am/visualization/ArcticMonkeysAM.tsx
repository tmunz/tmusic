import { Channel, SampleProvider } from '../../../sampleProvider/SampleProvider';
import { WaveformScene } from './WaveformScene';

export interface ArcticMonkeysAMProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  strokeWidth?: number;
}

export const ArcticMonkeysAM = ({
  sampleProvider,
  canvas,
  strokeWidth = 2.5,
}: ArcticMonkeysAMProps) => {

  const createWaveform = (channel: Channel, heigth: number) => (
    <WaveformScene
      width={canvas.width}
      height={heigth}
      sampleProvider={sampleProvider}
      channel={channel}
      strokeWidth={strokeWidth}
    />
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
      {sampleProvider.stereo ? (
        <>
          {createWaveform(Channel.LEFT, canvas.height / 2)} {createWaveform(Channel.RIGHT, canvas.height / 2)}
        </>
      ) : (
        createWaveform(Channel.MONO, canvas.width)
      )}
    </div>
  );
};
