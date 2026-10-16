import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for instant offline support and 4G/5G asset caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available for Recynova');
  },
  onOfflineReady() {
    console.log('Recynova is ready to work offline across all networks');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
