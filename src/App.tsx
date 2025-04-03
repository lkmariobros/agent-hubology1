
import Router from './Router';
import { ClerkAuthProvider } from './providers/ClerkAuthProvider'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster";

// Create a react-query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkAuthProvider>
        <Router />
        <Toaster />
      </ClerkAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
