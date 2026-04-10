import { SpectrumAnalyzerConfig } from '../../audio/analyzer/spectrum/SpectrumAnalyzerConfigs';
import { Visualization } from '../Visualization';
import { Violator } from './visualization/Violator';

const violator: Visualization = {
  id: 'violator',
  title: 'Violator',
  artist: 'Depeche Mode',
  design: 'Anton Corbijn',
  imgSrc: require('./violator.jpg'),
  description:
    "'Violator' is the seventh studio album by English electronic music band Depeche Mode, released on 19 March 1990 by Mute Records and named as sort of a joke. Preceded by the hit singles 'Personal Jesus' and 'Enjoy the Silence', Violator propelled the band into international stardom. The rose from this album's cover became the symbol for the 'black swarm' (Depeche Mode fans) and the whole synth pop genre itself. And that although the band had already headed away from their original sound towards a more stadium rock direction since the previous album.",
  component: Violator,
  color: '#111111',
  settings: {
    samples: new SpectrumAnalyzerConfig({ frequencyBands: 64, sampleSize: 64 }).settings(),
  },
  spotifyUri: 'spotify:album:45YmvYK4hB4CgQgTMuNRm8',
};

export default violator;
