import { FaGithub, FaGlobe } from 'react-icons/fa';
import './AboutComponent.css';

export const AboutComponent = () => (
  <div className="about-container">
    <h2>About</h2>
    <p style={{ marginTop: '2em' }}>
      This is an open-source project dedicated to visually interpreting music data, inspired by iconic album cover art.
      <br />
      Discover more about this project, its source code, and the author:
    </p>
    <div className="about-links">
      <a href="https://github.com/tmunz/tmusic" target="_blank" rel="noopener noreferrer">
        <FaGithub className="about-icon" />
        github
      </a>
      <a href="https://tmunz.art" target="_blank" rel="noopener noreferrer">
        <FaGlobe className="about-icon" />
        tmunz.art
      </a>
    </div>
  </div>
);
