import { createSampleSettings } from '../../sampleProvider/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { UnknownPleasures } from './visualization/UnknownPleasures';

const unknownPleasures: Visualization = {
  id: 'unknown-pleasures',
  title: 'Unknown Pleasures',
  artist: 'Joy Division',
  design: 'Peter Saville (Factory Records)',
  imgSrc: require('./unknown-pleasures.png'),
  description:
    'Unknown Pleasures is the debut studio album by English rock band Joy Division, released on 15 June 1979 by Factory Records. The artwork shows waveforms representing data from the first recorded pulsar, PSR B1919+21, which Saville took from an astronomy encyclopedia and inverted it. Stripped of context, the minimalist yet striking design conveys a sense of mystery and introspection, mirroring the haunting and atmospheric music of the album.',
  component: UnknownPleasures,
  color: '#000000',
  settings: {
    samples: createSampleSettings({ frameSize: 80, sampleSize: 30, sampleRate: 24 }),
    visualization: {
      baseIntensity: {
        id: 'baseIntensity',
        name: 'Base Intensity',
        description: 'Base intensity value for all samples',
        type: SettingType.NUMBER,
        value: 0.3,
        params: {
          min: 0,
          max: 1,
          step: 0.1,
        },
      },
      sampleWeight: {
        id: 'sampleWeight',
        name: 'Sample Weight',
        description: 'Weight factor for individual sample',
        type: SettingType.NUMBER,
        value: 0.3,
        params: {
          min: 0,
          max: 1,
          step: 0.1,
        },
      },
      dominatingWeight: {
        id: 'dominatingWeight',
        name: 'Dominating Weight',
        description: 'Weight factor for dominating sample',
        type: SettingType.NUMBER,
        value: 0.4,
        params: {
          min: 0,
          max: 1,
          step: 0.1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:5Dgqy4bBg09Rdw7CQM545s',
};

export default unknownPleasures;
