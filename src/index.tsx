import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppStateProvider } from './app/AppContext';

// Use basename only for GitHub Pages production deployment
// Locally (localhost) and on other domains, no basename is needed
const basename = window.location.hostname === 'tmunz.github.io' ? '/tmusic' : '/';

const appElement = document.getElementById('app');

if (appElement) {
  createRoot(appElement).render(
    <StrictMode>
      <Router basename={basename}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </Router>
    </StrictMode>
  );
}
