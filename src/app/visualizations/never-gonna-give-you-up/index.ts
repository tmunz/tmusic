import { PiInfoBold } from 'react-icons/pi';
import { createSampleSettings } from '../../sampleProvider/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { NeverGonnaGiveYouUp } from './visualization/NeverGonnaGiveYouUp';
import { ZoetropeInfo } from './zoetrope-info/ZoetropeInfo';

const neverGonnaGiveYouUp: Visualization = {
  id: 'never-gonna-give-you-up',
  title: 'Never Gonna Give You Up',
  artist: 'Rick Astley',
  design: 'Simon West (Director)',
  imgSrc: require('./whenever-you-need-somebody.jpg'),
  description:
    "'Never Gonna Give You Up' by Rick Astley – originally released on his 1987 album 'Whenever You Need Somebody' – became one of the most iconic songs of the 1980s. Decades later, it experienced a resurgence in popularity as the centerpiece of the internet prank known as 'Rickrolling' in which unsuspecting users are redirected to the song's music video. This visualization is based on a 2025 rerelease and features zoetrope-style visuals inspired primarily by scenes from the mentioned video. Learn more about the zoetrope effect in the Info tab.",
  component: NeverGonnaGiveYouUp,
  color: '#eae9e5',
  settings: {
    samples: createSampleSettings({ frameSize: 336, sampleSize: 107, spectralContrastBoost: 0.5 }),
    visualization: {
      record: {
        id: 'record',
        name: 'Record',
        description: 'Record to display in the visualization.',
        type: SettingType.NUMBER,
        value: 0,
        params: {
          min: 0.0,
          max: 2.0,
          step: 1.0,
        },
      },
      recordAutochange: {
        id: 'recordAutochange',
        name: 'Record Autochange',
        description: 'Changes the record after finishing Record Player Arm reaches the end.',
        type: SettingType.NUMBER, // TODO boolean
        value: 1,
        params: {
          min: 0.0,
          max: 1.0,
          step: 1.0,
        },
      },
      recordPlayerArmSpeed: {
        id: 'recordPlayerArmSpeed',
        name: 'Record Player Arm Speed',
        description: 'Speed at which the arm moves across the record during playback',
        type: SettingType.NUMBER,
        value: 1.0,
        params: {
          min: 0.1,
          max: 10.0,
          step: 0.1,
        },
      },
      recordPlayerOpacity: {
        id: 'recordPlayerOpacity',
        name: 'Record Player Opacity',
        description: 'Opacity of the record player overlay',
        type: SettingType.NUMBER,
        value: 1.0,
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
        value: 320,
        params: {
          min: 0,
          max: 360,
          step: 1,
        },
      },
      dataRatio: {
        id: 'dataRatio',
        name: 'Data Ratio',
        description: 'Ratio of audio data visualization intensity (0.0 to 1.0).',
        type: SettingType.NUMBER,
        value: 0.5,
        params: {
          min: 0.0,
          max: 1.0,
          step: 0.05,
        },
      },
      stroboscopicEffect: {
        id: 'stroboscopicEffect',
        name: 'Stroboscopic Effect',
        description:
          'Creates a freeze-frame effect by reducing rotation update frequency (0.0 = smooth, 1.0 = maximum stroboscopic effect).',
        type: SettingType.NUMBER,
        value: 0.95,
        params: {
          min: 0.0,
          max: 1.0,
          step: 0.05,
        },
      },
      stroboscopicAngle: {
        id: 'stroboscopicAngle',
        name: 'Stroboscopic Angle',
        description: 'Angle step size for stroboscopic frames in degrees (smaller = more frames).',
        type: SettingType.NUMBER,
        value: 6.67,
        params: {
          min: 1,
          max: 22.5,
          step: 0.01,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:6XhjNHCyCDyyGJRM5mg40G',
  menuItems: [{ icon: PiInfoBold, component: ZoetropeInfo }],
};

export default neverGonnaGiveYouUp;
