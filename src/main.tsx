
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

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
  root.render(
    <>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </TooltipProvider>
      <Toaster 
        expand={false} 
        visibleToasts={3} 
        closeButton={true}
        richColors={true}
        position="top-right"
      />
    </>
  );
}
