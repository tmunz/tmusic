import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { TameImpalaCurrents } from './visualization/TameImpalaCurrents';

const tameImpalaCurrents: Visualization = {
  id: 'tame-impala-currents',
  title: 'Currents',
  artist: 'Tame Impala',
  design: 'Robert Beatty',
  imgSrc: require('./tame-impala-currents.jpg'),
  description:
    "Currents is the third studio album by Tame Impala, released on 17 July 2015. The cover art, created by Robert Beatty, is based on a diagram of vortex shedding—visualizing turbulent flow and the way liquid or air flows around objects. These vibrant, psychedelic swirls perfectly capture the album's themes of transformation and change.",
  component: TameImpalaCurrents,
  color: '#f42a3e',
  settings: {
    samples: createSampleSettings(64, 64),
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
  spotifyUri: 'spotify:album:79dL7FLiJFOO0EoehUHQBv',
};

export default tameImpalaCurrents;
