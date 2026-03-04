import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { CrossingTheRubicon } from './visualization/CrossingTheRubicon';

const crossingTheRubicon: Visualization = {
  id: 'crossing-the-rubicon',
  title: 'Crossing the Rubicon',
  artist: 'The Sounds',
  design: '',
  imgSrc: require('./crossing-the-rubicon.jpg'),
  description: 'WIP Crossing the Rubicon is the second studio album by The Sounds, released on June 2, 2009.',
  component: CrossingTheRubicon,
  color: '#f9f1ed',
  settings: {
    samples: createSampleSettings({ frequencyBands: 32, sampleSize: 1 }),
    visualization: {
      intensity: {
        id: 'intensity',
        name: 'Intensity',
        description: 'The intensity of the music visualization',
        type: SettingType.NUMBER,
        value: 1,
        params: {
          min: 0,
          max: 2,
          step: 0.1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:5mJ34lsWCrhC9Sx3enK3Um',
};

export default crossingTheRubicon;
