import { useEffect, useState } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { ZoetropeSzene } from './ZoetropeScene';

export interface NeverGonnaGiveYouUpProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  dataStartAngle?: number;
  record?: number;
  dataRatio?: number;
  stroboscopicEffect?: number;
  stroboscopicAngle?: number;
}

const RECORDS = [
  require('./whenever-you-need-somebody-record-a.jpg'),
  require('./never-gonna-give-you-up-zoetrope-a.jpg'),
  require('./never-gonna-give-you-up-zoetrope-b.jpg'),
];

export const NeverGonnaGiveYouUp = ({ sampleProvider, canvas, dataStartAngle, record = 0, dataRatio, stroboscopicEffect, stroboscopicAngle }: NeverGonnaGiveYouUpProps) => {

  const [imageUrl, setImageUrl] = useState(RECORDS[record]);

  useEffect(() => {
    setImageUrl(RECORDS[record]);
  }, [record]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <ZoetropeSzene
        width={canvas.width}
        height={canvas.height}
        sampleProvider={sampleProvider}
        dataStartAngle={dataStartAngle}
        dataRatio={dataRatio}
        stroboscopicEffect={stroboscopicEffect}
        stroboscopicAngle={stroboscopicAngle}
        imageUrl={imageUrl}
      />
    </div>
  );
};
