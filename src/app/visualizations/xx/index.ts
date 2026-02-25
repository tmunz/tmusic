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
    "XX is the debut studio album by the English indie pop band The XX, released in 2009. The album features a minimalist sound characterized by sparse arrangements, intimate vocals, and a blend of electronic and indie pop elements. Its cover art reflects the album's understated and elegant aesthetic. Tracks such as 'Crystalised' and 'VCR' showcase the band's unique approach to songwriting and production, earning critical acclaim.",
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
        value: 0.,
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
