import { createSampleSettings } from '../../audio/SampleSettings';
import { Visualization } from '../Visualization';
import { FiveMilesOut } from './visualization/FiveMilesOut';

const fiveMilesOut: Visualization = {
  id: 'five-miles-out',
  title: 'Five Miles Out',
  artist: 'Mike Oldfield',
  design: 'Gerald Coulson',
  imgSrc: require('./five-miles-out.jpg'),
  description:
    "WIP 'Five Miles Out' is the seventh studio album by Mike Oldfield, released in 1982.",
  component: FiveMilesOut,
  color: '#1a1a1a',
  settings: {
    samples: createSampleSettings(256, 32),
  },
  spotifyUri: 'spotify:album:1NqFhS3YNSTxowqOJ0TjOR',
};

export default fiveMilesOut;
