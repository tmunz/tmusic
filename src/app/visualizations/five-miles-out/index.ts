import { PiKeyboard } from 'react-icons/pi';
import { SpectrumAnalyzerConfig } from '../../audio/analyzer/spectrum/SpectrumAnalyzerConfigs';
import { Visualization } from '../Visualization';
import { FiveMilesOut } from './visualization/FiveMilesOut';
import { FiveMilesOutInstructions } from './FiveMilesOutInstructions';
import { SettingType } from '../../settings/Setting';

const fiveMilesOut: Visualization = {
  id: 'five-miles-out',
  title: 'Five Miles Out',
  artist: 'Mike Oldfield',
  design: 'Gerald Coulson',
  imgSrc: require('./five-miles-out.jpg'),
  description:
    "'Five Miles Out' is the seventh studio album by Mike Oldfield, released in 1982. The album marked a more commercial direction for Oldfield, featuring vocals and a fuller band sound. The cover artwork by Gerald Coulson is an exemplary piece of hand-drawn cover art from the 1980s. Coulson's airbrush and pencil work captures the main theme of the album and its soaring, atmospheric soundscapes. The artwork stands as a testament to the craftsmanship of pre-digital album design, where artists relied on their drawing skills and traditional media to create evocative imagery.",
  component: FiveMilesOut,
  color: '#1a1a1a',
  settings: {
    samples: new SpectrumAnalyzerConfig({ frequencyBands: 32, sampleSize: 100 }).settings(),
    visualization: {
      intensity: {
        id: 'intensity',
        name: 'Intensity',
        description: 'Intensity of the audio data effect on the clouds',
        type: SettingType.NUMBER,
        value: 0.3,
        params: {
          min: 0,
          max: 1,
          step: 0.05,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:1NqFhS3YNSTxowqOJ0TjOR',
  menuItems: [{ icon: PiKeyboard, component: FiveMilesOutInstructions }],
};

export default fiveMilesOut;
