import { PiInfoBold } from 'react-icons/pi';
import { createSampleSettings } from '../../sampleProvider/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { EnTuCalle } from './visualization/EnTuCalle';
import { MondrianInfo } from './mondrian-info/MondrianInfo';

const enTuCalle: Visualization = {
  id: 'en-tu-calle',
  title: 'En tu calle',
  artist: 'Los Flechazos',
  design: 'Mondrian-inspired',
  imgSrc: require('./en-tu-calle.jpg'),
  description:
    "Mondrian-inspired album artwork has appeared throughout music history. One of the most creative interpretations of this style comes from Los Flechazos' EP 'En tu calle'. The Spanish band seamlessly integrates themselves into the geometric composition, transforming the classic aesthetic into a fresh visual experience. Explore the info tab to learn more about Piet Mondrian's composition approach and create your own artwork.",
  component: EnTuCalle,
  color: '#f9f9f9',
  settings: {
    samples: createSampleSettings({
      frameSize: 6,
      sampleSize: 60,
    }),
    visualization: {
      borderWidth: {
        id: 'borderWidth',
        name: 'Border Width',
        description: 'Width of the rectangle borders',
        type: SettingType.NUMBER,
        value: 8.0,
        params: {
          min: 0.0,
          max: 20.0,
          step: 1.0,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:1ARjW7lpmDZKB6xMfABmfw',
  menuItems: [{ icon: PiInfoBold, component: MondrianInfo }],
};

export default enTuCalle;
