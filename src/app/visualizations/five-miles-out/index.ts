import { PiKeyboard } from 'react-icons/pi';
import { createSampleSettings } from '../../audio/SampleSettings';
import { Visualization } from '../Visualization';
import { FiveMilesOut } from './visualization/FiveMilesOut';
import { FiveMilesOutInstructions } from './FiveMilesOutInstructions';

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
    samples: createSampleSettings(32, 128),
  },
  spotifyUri: 'spotify:album:1NqFhS3YNSTxowqOJ0TjOR',
  menuItems: [{ icon: PiKeyboard, component: FiveMilesOutInstructions }],
};

export default fiveMilesOut;
