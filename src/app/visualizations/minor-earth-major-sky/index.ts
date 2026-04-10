import { SpectrumAnalyzerConfig } from '../../audio/analyzer/spectrum/SpectrumAnalyzerConfigs';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { MinorEarthMajorSky } from './visualization/MinorEarthMajorSky';

const minorEarthMajorSky: Visualization = {
  id: 'minor-earth-major-sky',
  title: 'Minor Earth Major Sky',
  artist: 'A-ha',
  design: 'Kjetil Try, Magne Furuholmen',
  imgSrc: require('./minor-earth-major-sky.jpg'),
  description:
    "'Minor Earth Major Sky' is the sixth studio album by Norwegian band A-ha, released on 17 July 2000, marking their return after a four-year hiatus. The album represented a creative rebirth for the band, moving away from their 80s synth-pop roots towards a more mature, guitar-driven sound. The imagery of a disassembled airplane powerfully evokes themes of deconstruction, isolation, and transformation — a visual metaphor for the band's own artistic disassembly and reconstruction. The vast, minimalist composition with its muted color palette creates a sense of emptiness and introspection, just like the album's contemplative tone.",
  component: MinorEarthMajorSky,
  color: '#aad8e7',
  settings: {
    samples: new SpectrumAnalyzerConfig({ frequencyBands: 32, sampleSize: 64 }).settings(),
    visualization: {
      intensity: {
        id: 'intensity',
        name: 'Intensity',
        description: 'The intensity of the music visualization (dust).',
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
  spotifyUri: 'spotify:album:2aHH87T7YudCAyUieyIAow',
};

export default minorEarthMajorSky;
