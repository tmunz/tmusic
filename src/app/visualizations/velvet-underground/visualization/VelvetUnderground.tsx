import { Suspense } from 'react';
import { Overlay } from './Overlay';
import { SampleProvider } from '../../../audio/SampleProvider';
import { BananaScene } from './BananaScene';

export interface VelvetUndergroundProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
}

export const VelvetUnderground = (props: VelvetUndergroundProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Suspense fallback={null}>
        <BananaScene sampleProvider={props.sampleProvider} />
      </Suspense>
      <Overlay />
    </div>
  );
};
