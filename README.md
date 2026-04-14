# TMusic (Musicbox-GUI)
**[Try it yourself](https://tmunz.github.io/tmusic/)**

## Description
tmusic is an interactive music visualization web application that transforms audio into stunning visual experiences inspired by iconic album artwork. Visualize your music in real-time using multiple audio sources — all running directly in your browser.

Experience your favorite music like never before with dynamic, real-time visualizations based on legendary album covers. Whether you're listening to Spotify, playing audio from a browser tab, uploading your own files, or using your microphone, tmusic brings your audio to life with animated graphics that react to the sound.

Audio Sources
• Browser Tab Audio - Captures audio from any tab (YouTube, SoundCloud, Spotify Web, etc.), only available via Browser Extension: [Chrome Web Store](https://chromewebstore.google.com/detail/tmusic/aceajmhnmghpmiiaddlcoamibkgabbch)
• Spotify - Connect your Spotify account for seamless playback and visualization (Spotify Premium Account required)
• File Upload - Upload MP3, WAV, or other audio files from your device
• Microphone - needs Browser permission
• Web Audio Streams

Visualizations
• Unknown Pleasures - Inspired by Joy Division's iconic pulsar wave artwork
• The Dark Side of the Moon - Based on Pink Floyd's legendary prism design
• Abbey Road - Featuring The Beatles' classic zebra crossing aesthetic
• Violator - Channeling Depeche Mode's minimal rose imagery
• Blue Monday - New Order's floppy disk color spectrum design
• Velvet Underground & Nico - Andy Warhol's banana pop-art style
• Never Gonna Give You Up - Zoetrope vinyl record of Rick Astley's 80s classic on a Braun SK-61
• Trans-Europe Express - Kraftwerk
• AM - Arctic Monkeys
• Currents - Tame Impala
...an oscilloscope and many more!

Each visualization is fully interactive and responds in real-time to the audio's characteristics, creating a unique experience every time you play.

## Development notes

- Run `npm install` to install dependencies.
- Use `npm run start` to start the dev server.
- Use `npm run lint` and `npm run format` to lint and format code.
- `npm run type-check` runs TypeScript checks.

## Adding visualizations

- Create a new folder under `src/app/visualizations/<kebab-name>`.
- Add an `index.ts` exporting a default Visualization object with fields: id (kebab-case), title, artist, design, imgSrc (import or require), description, component, color, settings.
- Export the visualization component from `visualization/<ComponentName>.tsx` and ensure the component name and filename match the exported symbol.
- Update `src/app/visualizations/index.ts` will automatically pick up new folders if you import and include them in the export list.
