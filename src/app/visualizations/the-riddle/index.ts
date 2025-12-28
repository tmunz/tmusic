import { createSampleSettings } from '../../audio/SampleSettings';
import { Visualization } from '../Visualization';
import { TheRiddle } from './visualization/TheRiddle';

const theRiddle: Visualization = {
  id: 'the-riddle',
  title: "L'Amour Toujours",
  artist: "Gigi D'Agostino",
  design: 'Ged Haney, Andreas Hykade',
  imgSrc: require('./the-riddle.png'),
  description:
    "This visualization is actually not based on the album cover art, it is inspired by the iconic animated music videos of Gigi D'Agostino's 1999 masterpiece L'Amour Toujours. The distinctive stick-figure aesthetic from videos like 'The Riddle' and 'Bla Bla Bla' captured the essence of late 90s electronic music culture. This visualization reimagines that minimalist charm with a dynamic audio-reactive landscape where hills and valleys pulse and morph in perfect sync with the music, creating a mesmerizing journey through sound and motion.",
  component: TheRiddle,
  color: '#01A101',
  settings: {
    samples: createSampleSettings(32, 64),
  },
  spotifyUri: 'spotify:album:5aSbB0dVq5o7N5eSfnexjV',
};

export default theRiddle;
