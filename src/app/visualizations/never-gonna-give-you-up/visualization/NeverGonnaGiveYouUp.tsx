import { useEffect, useState } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { ZoetropeSzene } from './ZoetropeScene';
import { useAppState, VisualizationAction } from '../../../AppContext';

export interface NeverGonnaGiveYouUpProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  record?: number;
  recordAutochange?: boolean;
  dataStartAngle?: number;
  dataRatio?: number;
  stroboscopicEffect?: number;
  stroboscopicAngle?: number;
  recordPlayerOpacity?: number;
  recordPlayerArmSpeed?: number;
}

const RECORDS = [
  require('./never-gonna-give-you-up-zoetrope-b.jpg'),
  require('./never-gonna-give-you-up-zoetrope-a.jpg'),
  require('./whenever-you-need-somebody-record-a.jpg'),
];

export const NeverGonnaGiveYouUp = ({
  sampleProvider,
  canvas,
  dataStartAngle,
  record = 0,
  recordAutochange = false,
  dataRatio,
  stroboscopicEffect,
  stroboscopicAngle,
  recordPlayerOpacity = 0.8,
  recordPlayerArmSpeed = 1.0,
}: NeverGonnaGiveYouUpProps) => {
  const [imageUrl, setImageUrl] = useState(RECORDS[record]);
  const { dispatch } = useAppState();

  useEffect(() => {
    setImageUrl(RECORDS[record]);
  }, [record]);

  const handleRecordFinished = () => {
    if (recordAutochange) {
      dispatch({
        type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
        section: 'visualization',
        key: 'record',
        value: (record + 1) % RECORDS.length,
      });
    }
  };

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
        recordPlayerOpacity={recordPlayerOpacity}
        recordPlayerArmSpeed={recordPlayerArmSpeed}
        onRecordFinished={handleRecordFinished}
      />
    </div>
  );
};
