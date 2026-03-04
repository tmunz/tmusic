import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { XX } from './visualization/XX';

const xx: Visualization = {
  id: 'xx',
  title: 'XX',
  artist: 'The XX',
  design: 'Phil Lee',
  imgSrc: require('./xx.png'),
  description:
    "Maybe one of the greatest introductions ever. The XX presented themselves on their debut studio album 'XX' with an epic opening track that already lays out the theme of the album without revealing too much of what will come. The album continues with this minimalist sound characterized by sparse arrangements, leading to the intimate vocal sections, and a blend of electronic and indie pop elements of the following tracks such as 'Crystalised' and 'VCR', where you can find true showcase of the band's unique approach to songwriting and production. Sometimes, great music really is as simple as this cover art.",
  component: XX,
  color: '#000000',
  settings: {
    samples: createSampleSettings({ frequencyBands: 80, sampleSize: 40 }),
    visualization: {
      numberOfSections: {
        id: 'numberOfSections',
        name: 'Number of Sections',
        description: 'Number of sections in the visualization',
        type: SettingType.NUMBER,
        value: 4,
        params: {
          min: 1,
          max: 10,
          step: 1,
        },
      },
      sectionWidth: {
        id: 'sectionWidth',
        name: 'Section Width',
        description: 'Width of each section',
        type: SettingType.NUMBER,
        value: 0.15,
        params: {
          min: 0.01,
          max: 1.0,
          step: 0.01,
        },
      },
      sectionLength: {
        id: 'sectionLength',
        name: 'Section Length',
        description: 'Length of each section',
        type: SettingType.NUMBER,
        value: 0.8,
        params: {
          min: 0.01,
          max: 1.0,
          step: 0.01,
        },
      },
      offsetAngle: {
        id: 'offsetAngle',
        name: 'Offset Angle',
        description: 'Angle offset for the visualization',
        type: SettingType.NUMBER,
        value: 0,
        params: {
          min: 0.0,
          max: 360.0,
          step: 0.1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:2av2ZSHlvD7rvLSsMvtYCG',
};

export default xx;
