import { createRoot } from 'react-dom/client';
import './index.css';
import { initSentry } from './lib/sentry';
import App from './App.clerk'; // Changed from FixedApp to App.clerk

// Get root element - do this before Sentry initialization
const rootElement = document.getElementById("root");

// Make sure we have a root element before proceeding
if (!rootElement) {
  console.error("Root element not found! Cannot mount React application.");
} else {
  // Initialize Sentry after we've verified DOM is available
  initSentry();

  // Create and render React root
  const root = createRoot(rootElement);
  root.render(<App />);
}
