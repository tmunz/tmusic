import { WaveformAnalyzerConfig } from '../../audio/analyzer/waveform/WaveformAnalyzerConfig';
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
    "'AM' is the fifth studio album by Arctic Monkeys, released on 6 September 2013. The album marked a stylistic shift towards a heavier, more groove-oriented sound influenced by hip-hop and stoner rock. The minimalist black and white artwork depicts a sound waveform cleverly shaped to form the letters 'AM' at its center. The brutally simple design — with its high contrast and geometric precision — perfectly captures the album's slick, confident aesthetic and has become one of the most recognizable album covers of the 2010s, cementing itself as a modern classic of album art.",
  component: ArcticMonkeysAM,
  color: '#060606',
  settings: {
    samples: new WaveformAnalyzerConfig({ sampleSize: 1, sampleRate: 30 }).settings(),
    visualization: {
      strokeWidth: {
        id: 'strokeWidth',
        name: 'Stroke Width',
        description: 'Width of the waveform line',
        type: SettingType.NUMBER,
        value: 3,
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
