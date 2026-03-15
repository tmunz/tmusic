import { createSampleSettings } from '../../sampleProvider/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { ArcticMonkeysAM } from './visualization/ArcticMonkeysAM';

const arcticMonkeysAM: Visualization = {
  id: 'arctic-monkeys-am',
  title: 'AM',
  artist: 'Arctic Monkeys',
  design: 'Alex Turner / Matthew Cooper',
  imgSrc: require('./arctic-monkeys-am.jpg'),
  description:
    'AM is the fifth studio album by Arctic Monkeys, released in 2013. The album features a minimalist black and white cover with a simple waveform design.',
  component: ArcticMonkeysAM,
  color: '#000000',
  settings: {
    samples: createSampleSettings({ frameSize: 1024, sampleSize: 1, sampleRate: 60, waveform: true }),
    visualization: {
      strokeWidth: {
        id: 'strokeWidth',
        name: 'Stroke Width',
        description: 'Width of the waveform line',
        type: SettingType.NUMBER,
        value: 10,
        params: {
          min: 0.5,
          max: 20,
          step: 0.1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:78bpIziExqiI9qztvNFlQu',
};

export default arcticMonkeysAM;
