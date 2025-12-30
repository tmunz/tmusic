import { createSampleSettings } from '../../audio/SampleSettings';
import { Visualization } from '../Visualization';
import { Tron } from './visualization/Tron';

const tron: Visualization = {
  id: 'tron',
  title: 'TRON',
  artist: 'Daft Punk',
  design: 'Disney',
  imgSrc: require('./tron-legacy.png'),
  description:
    "TRON: Legacy is a 2010 science fiction film soundtrack and the only soundtrack album by French electronic music duo Daft Punk. The album features a blend of orchestral and electronic elements, creating a futuristic soundscape that complements the film's digital world. The iconic grid patterns and neon aesthetic of TRON inspire this visualization.",
  component: Tron,
  color: '#000000',
  settings: {
    samples: createSampleSettings(64, 64),
  },
  spotifyUri: 'spotify:album:3AMXFnwHWXCvNr5NCCpLZI',
};

export default tron;
