import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ClerkAuthProvider } from './context/clerk/ClerkProvider';
import { NotificationProvider } from './context/NotificationContext';
import Router from './Router.clerk'; // We'll create this next

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: import.meta.env.PROD ? 60 * 1000 : 0, // 1 minute in production, 0 in development
      gcTime: import.meta.env.PROD ? 5 * 60 * 1000 : 60 * 1000, // 5 minutes in prod, 1 minute in dev
      refetchOnWindowFocus: import.meta.env.PROD, // Only refetch on window focus in production
      retry: import.meta.env.PROD ? 2 : 1, // More retries in production
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff with max 30s
    },
    mutations: {
      retry: import.meta.env.PROD ? 1 : 0, // Retry mutations in production
      networkMode: 'always',
    },
  },
});

// Make queryClient globally available for manual invalidations
if (typeof window !== 'undefined') {
  window.queryClient = queryClient;
}

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = 'pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkAuthProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </ClerkAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
