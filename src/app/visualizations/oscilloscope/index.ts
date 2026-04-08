import { WaveformAnalyzerSettings } from '../../audio/analyzer/waveform/WaveformAnalyzerSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { Oscilloscope } from './visualization/Oscilloscope';

const oscilloscope: Visualization = {
  id: 'oscilloscope',
  title: 'Oscilloscope Music',
  artist: 'Jerobeam Fenderson',
  design: 'Jerobeam Fenderson',
  imgSrc: require('./oscilloscope-music.jpg'),
  description:
    "'Oscilloscope Music' is a unique album by artist Jerobeam Fenderson, where the music is generated from the visual patterns of an oscilloscope. The album features a series of tracks that are created by manipulating the waveforms displayed on an oscilloscope, resulting in a mesmerizing blend of electronic sounds and visual art. Each track corresponds to a specific waveform pattern, making it a truly immersive audiovisual experience.",
  component: Oscilloscope,
  color: '#040404',
  settings: {
    samples: new WaveformAnalyzerSettings({ stereo: true }).build(),
    visualization: {
      strokeWidth: {
        id: 'strokeWidth',
        name: 'Stroke Width',
        description: 'Width of the waveform line',
        type: SettingType.NUMBER,
        value: 2,
        params: {
          min: 0.5,
          max: 20,
          step: 0.1,
        },
      },
      swapAxis: {
        id: 'swapAxis',
        name: 'Swap Axis',
        description: 'Swap X and Y axis',
        type: SettingType.BOOLEAN,
        value: false,
      },
      invertX: {
        id: 'invertX',
        name: 'Invert X',
        description: 'Invert the X axis',
        type: SettingType.BOOLEAN,
        value: false,
      },
      invertY: {
        id: 'invertY',
        name: 'Invert Y',
        description: 'Invert the Y axis',
        type: SettingType.BOOLEAN,
        value: false,
      },
      hue: {
        id: 'hue',
        name: 'Hue',
        description: 'Color hue rotation',
        type: SettingType.NUMBER,
        value: 120,
        params: {
          min: 0,
          max: 360,
          step: 1,
        },
      },
      intensity: {
        id: 'intensity',
        name: 'Intensity',
        description: 'Line brightness/intensity',
        type: SettingType.NUMBER,
        value: 1.0,
        params: {
          min: 0.0,
          max: 2.0,
          step: 0.1,
        },
      },
      glow: {
        id: 'glow',
        name: 'Glow',
        description: 'Glow/bloom effect intensity',
        type: SettingType.NUMBER,
        value: 1.0,
        params: {
          min: 0.0,
          max: 2.0,
          step: 0.1,
        },
      },
      grid: {
        id: 'grid',
        name: 'Grid',
        description: 'Show grid overlay',
        type: SettingType.NUMBER,
        value: 0.5,
        params: {
          min: 0,
          max: 1,
          step: 0.1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:2SzcGpzp4bhoyBHgJqV53r'
};

export default oscilloscope;
