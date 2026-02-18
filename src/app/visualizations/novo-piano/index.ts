import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { NovoPiano } from './visualization/NovoPiano';

const novoPiano: Visualization = {
  id: 'novo-piano',
  title: 'Novö Piano',
  artist: 'Maxence Cyrin',
  design: 'Maxence Cyrin',
  imgSrc: require('./novo-piano.jpg'),
  description:
    "'Novö Piano' by Maxence Cyrin is a stunning collection of piano interpretations of iconic songs, transforming rock and pop classics into intimate, minimalist compositions. Released in 2005, this album showcases Cyrin's virtuosic piano skills and his ability to reimagine familiar melodies with emotional depth and elegance. The album's aesthetic is one of simplicity and beauty, much like its stripped-down musical arrangements.",
  component: NovoPiano,
  color: '#b2b3b5',
  settings: {
    samples: createSampleSettings(61, 1),
    visualization: {
      intensity: {
        id: 'intensity',
        name: 'Intensity',
        description: 'Intensity of the audio data effect',
        type: SettingType.NUMBER,
        value: 1.0,
        params: {
          min: 0.0,
          max: 2.0,
          step: 0.1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:21wMUhXhWLew2zsWQhlYEM',
};

export default novoPiano;
