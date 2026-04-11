import { FaGithub, FaGlobe } from 'react-icons/fa';
import './AboutComponent.css';

export const AboutComponent = () => (
  <div className="about-container">
    <h2>About</h2>
    <p>
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
    <p className="about-copyright">
      All album cover artwork and related imagery are the property of their respective copyright holders. Their
      inclusion in this project is intended to fall under fair use, as the images are presented in a non-commercial
      context for educational and transformative purposes. They are accompanied by commentary and analysis, and their
      use does not aim to compete with or reduce the market value of the original works.
    </p>
  </div>
);
