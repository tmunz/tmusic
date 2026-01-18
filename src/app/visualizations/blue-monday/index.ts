import { PiBarcode } from 'react-icons/pi';
import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { BlueMonday } from './visualization/BlueMonday';
import { ColorCoding } from './color-coding/ColorCoding';

const blueMonday: Visualization = {
  id: 'blue-monday',
  title: 'Blue Monday',
  artist: 'New Order',
  design: 'Peter Saville',
  imgSrc: require('./blue-monday.jpg'),
  description:
    "'Blue Monday' by New Order is the best-selling 12-inch single of all time. The original artwork is designed to resemble a 5¼ inch floppy disk. The sleeve does not display either the group name or song title. Instead the legend 'FAC 73 BLUE MONDAY AND THE BEACH NEW ORDER' is represented in code by a series of coloured blocks (front & back). The key enabling this to be deciphered was printed on the back sleeve of the album from the same era 'Power, Corruption & Lies'. You can encode your own text in the Encoding tab to see how it would look in the 'Peter Saville' color code.",
  component: BlueMonday,
  color: '#252525',
  settings: {
    samples: createSampleSettings(256, 32),
    visualization: {
      coverOpacity: {
        id: 'coverOpacity',
        name: 'Cover Opacity',
        description: 'Opacity of the album cover in the visualization.',
        type: SettingType.NUMBER,
        value: 0.95,
        params: {
          min: 0.0,
          max: 1.0,
          step: 0.05,
        },
      },
      dataStartAngle: {
        id: 'dataStartAngle',
        name: 'Data Start Angle',
        description: 'Starting angle (in degrees) for the audio data visualization.',
        type: SettingType.NUMBER,
        value: 354,
        params: {
          min: 0,
          max: 360,
          step: 1,
        },
      }
    },
  },
  spotifyUri: 'spotify:album:4BPqSw0Zt0I85xBQVF38KF',
  menuItems: [{ icon: PiBarcode, component: ColorCoding }],
};

export default blueMonday;
