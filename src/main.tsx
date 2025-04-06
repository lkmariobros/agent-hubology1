
import { createRoot } from 'react-dom/client';
import Router from './Router.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './providers/ThemeProvider';

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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </TooltipProvider>
        <Toaster 
          expand={false} 
          visibleToasts={3} 
          closeButton={true}
          richColors={true}
          position="top-right"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
