import { PiPen } from 'react-icons/pi';
import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { VivaLaVida } from './visualization/VivaLaVida';
import { VivaLaVidaDrawing } from './drawing-board/VivaLaVidaDrawing';
import path from './visualization/VivaLaVidaPath';

const vivaLaVida: Visualization = {
  id: 'viva-la-vida',
  title: 'Viva la Vida',
  artist: 'Coldplay',
  design: 'Coldplay & Eugène Delacroix',
  imgSrc: require('./viva-la-vida.jpg'),
  description:
    "'Viva la Vida or Death and All His Friends' is the fourth studio album by the British rock band Coldplay, released on June 12, 2008. The album's artwork is a painting by French artist Eugène Delacroix, titled 'Liberty Leading the People', which was modified by Coldplay's drummer Will Champion. The painting depicts the July Revolution of 1830 in France, and the album's title translates to 'Long Live Life'.",
  component: VivaLaVida,
  color: '#342b1c',
  settings: {
    samples: createSampleSettings(32, 32),
    visualization: {
      speed: {
        id: 'speed',
        name: 'Speed',
        description: 'Speed of drawing animation',
        type: SettingType.NUMBER,
        value: 1.0,
        params: {
          min: 0.1,
          max: 5.0,
          step: 0.1,
        },
      },
      drawingPath: {
        id: 'drawingPath',
        name: 'Drawing Path',
        description: 'Managed by Drawing Board',
        type: SettingType.EXTERNAL,
        value: path,
      },
    },
  },
  menuItems: [{ icon: PiPen, component: VivaLaVidaDrawing }],
  spotifyUri: 'spotify:album:0cnd1tlGnbfScH1KWwgxan',
};

export default vivaLaVida;
