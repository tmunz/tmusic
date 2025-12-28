import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppStateProvider } from './app/AppContext';

const appElement = document.getElementById('app');

if (appElement) {
  createRoot(appElement).render(
    <StrictMode>
      <Router basename={process.env.PUBLIC_PATH}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </Router>
    </StrictMode>
  );
}
