
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import AuthProvider from './providers/AuthProvider';
import { NotificationProvider } from './context/NotificationContext';

// Initialize Sentry before rendering the app
initSentry();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
  </AuthProvider>
);
