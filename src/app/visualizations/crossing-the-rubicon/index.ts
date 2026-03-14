import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { CrossingTheRubicon } from './visualization/CrossingTheRubicon';

const crossingTheRubicon: Visualization = {
  id: 'crossing-the-rubicon',
  title: 'Crossing the Rubicon',
  artist: 'The Sounds',
  design: 'Celine Oberle',
  imgSrc: require('./crossing-the-rubicon.jpg'),
  description: "This is the Vinyl edition of Crossing the Rubicon by 'The Sounds', which is mirrored in comparison to the other media releases, what makes it more elegant, but loses nothing of the thrill and power of the imagery. A similar split of colors as in the visualization is also used on the cover's inside. Blue represents the lower frequencies, red mid tones, yellow the heigher ones.",
  component: CrossingTheRubicon,
  color: '#f9f1ed',
  settings: {
    samples: createSampleSettings({ frequencyBands: 18, sampleSize: 1 }),
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
