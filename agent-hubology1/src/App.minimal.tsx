import { ClerkProvider, SignIn } from "@clerk/clerk-react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Create a query client
const queryClient = new QueryClient();

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  'pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-white text-center mb-6">
                Sign In with Clerk
              </h1>
              <SignIn />
            </div>
          </div>
          <Toaster />
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
