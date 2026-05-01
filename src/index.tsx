import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AppStateProvider } from './app/AppContext';

const appElement = document.getElementById('app');

const app = () => <AppStateProvider>
  <App />
</AppStateProvider>;

if (appElement) {
  createRoot(appElement).render(
    <StrictMode>
      {process.env.IS_EXTENSION ? (
        <HashRouter>
          {app()}
        </HashRouter>
      ) : (
        <BrowserRouter basename={process.env.PUBLIC_PATH}>
          {app()}
        </BrowserRouter>
      )}
    </StrictMode>
  );
}
