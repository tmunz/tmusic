import { createSampleSettings } from '../../audio/SampleSettings';
import { SettingType } from '../../settings/Setting';
import { Visualization } from '../Visualization';
import { AbbeyRoad } from './visualization/AbbeyRoad';

const abbeyRoad: Visualization = {
  id: 'abbey-road',
  title: 'Abbey Road',
  artist: 'The Beatles',
  design: 'Iain Macmillan',
  imgSrc: require('./abbey-road.jpg'),
  description:
    "'Abbey Road' is the eleventh studio album by The Beatles, released on 26 September 1969. The iconic cover photograph by Iain Macmillan shows the four Beatles walking across the zebra crossing outside Abbey Road Studios. The simple yet powerful composition has become one of the most recognizable and parodied album covers in music history, capturing a moment of casual elegance that perfectly embodies the band's legacy.",
  component: AbbeyRoad,
  color: '#45830c',
  settings: {
    samples: createSampleSettings(36, 32),
    visualization: {
      direction: {
        id: 'direction',
        name: 'Direction',
        description: 'Rotation of the audio data visualization (0-3, each step rotates 90 degrees)',
        type: SettingType.NUMBER,
        value: 0,
        params: {
          min: 0,
          max: 3,
          step: 1,
        },
      },
    },
  },
  spotifyUri: 'spotify:album:0ETFjACtuP2ADo6LFhL6HN',
};

export default abbeyRoad;
