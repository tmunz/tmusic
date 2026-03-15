import { PiKeyboard } from 'react-icons/pi';
import { createSampleSettings } from '../../sampleProvider/SampleSettings';
import { Visualization } from '../Visualization';
import { FiveMilesOut } from './visualization/FiveMilesOut';
import { FiveMilesOutInstructions } from './FiveMilesOutInstructions';
import { SettingType } from '../../settings/Setting';

const fiveMilesOut: Visualization = {
  id: 'five-miles-out',
  title: 'Five Miles Out',
  artist: 'Mike Oldfield',
  design: 'Gerald Coulson',
  imgSrc: require('./five-miles-out.jpg'),
  description: "'Five Miles Out' is the seventh studio album by Mike Oldfield, released in 1982.",
  component: FiveMilesOut,
  color: '#1a1a1a',
  settings: {
    samples: createSampleSettings({ frameSize: 32, sampleSize: 100 }),
    visualization: {
      intensity: {
        id: 'intensity',
        name: 'Intensity',
        description: 'Intensity of the audio data effect on the clouds',
        type: SettingType.NUMBER,
        value: 0.3,
        params: {
          min: 0,
          max: 1,
          step: 0.05,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:1NqFhS3YNSTxowqOJ0TjOR',
  menuItems: [{ icon: PiKeyboard, component: FiveMilesOutInstructions }],
};

export default fiveMilesOut;
