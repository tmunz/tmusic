import { createSampleSettings } from '../../audio/SampleSettings';
import { Visualization } from '../Visualization';
import { ParallelLines } from './visualization/ParallelLines';

const parallelLines: Visualization = {
  id: 'parallel-lines',
  title: 'Parallel Lines',
  artist: 'Blondie',
  design: 'Edo Bertoglio',
  imgSrc: require('./parallel-lines.jpg'),
  description:
    'Parallel Lines is the third studio album by American rock band Blondie, released on September 23, 1978. The album marked a significant shift in Blondie\'s musical direction, embracing disco and new wave sounds alongside their punk rock roots, featuring disco-influenced hits like "Heart of Glass." The iconic cover art, photographed by Edo Bertoglio, features the band members lined up against a stark white wall wearing black and white attire, creating a striking geometric composition that became one of the most recognizable album covers of the late 1970s.',
  component: ParallelLines,
  color: '#000000',
  settings: {
    samples: createSampleSettings(11, 32),
  },
  spotifyUri: 'spotify:album:4M6s2jbhKWEcOdXZ8WiHts',
};

export default parallelLines;
