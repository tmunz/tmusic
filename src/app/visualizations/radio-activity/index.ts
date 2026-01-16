import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { RadioActivity } from './visualization/RadioActivity';

const radioActivity: Visualization = {
  id: 'radio-activity',
  title: 'Radio Activity',
  artist: 'Kraftwerk',
  design: 'Emil Schult',
  imgSrc: require('./radio-activity.jpg'),
  description:
    "Radio-Activity is the fifth studio album by Kraftwerk, released in 1975. The album explores themes of radio communication and nuclear energy, blending electronic soundscapes with innovative production techniques. Its minimalist reissue cover features a bold, stripped-down design that mirrors the album's futuristic and experimental spirit. Tracks such as 'Radioactivity' and 'Antenna' highlight Kraftwerk's pioneering approach to electronic music, cementing the album's lasting influence on the genre.",
  component: RadioActivity,
  color: '#fbff36',
  settings: {
    samples: createSampleSettings(32, 16),
    visualization: {
      centerDataRatio: {
        id: 'centerDataRatio',
        name: 'Center Data Ratio',
        description: 'Ratio of volume data affecting the radius of the center circle',
        type: SettingType.NUMBER,
        value: 0.1,
        params: {
          min: 0.0,
          max: 1.0,
          step: 0.05,
        },
      },
      radiationDataRatio: {
        id: 'radiationDataRatio',
        name: 'Radiation Data Ratio',
        description: 'Ratio of frequency data affecting the color intensity of the radiation sectors',
        type: SettingType.NUMBER,
        value: 0.8,
        params: {
          min: 0.0,
          max: 1.0,
          step: 0.05,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:4WXvlXxPuiYWGiUQqwsQXn',
};

export default radioActivity;
