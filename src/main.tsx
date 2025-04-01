
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import AuthProvider from './providers/AuthProvider';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'sonner';

// Initialize Sentry before rendering the app
initSentry();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <NotificationProvider>
      <App />
      <Toaster position="top-right" />
    </NotificationProvider>
  </AuthProvider>
);
