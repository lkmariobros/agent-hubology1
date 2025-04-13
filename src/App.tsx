import { SignIn } from '@clerk/clerk-react';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a simple query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
          <h1 className="text-2xl font-bold mb-8">Agent Hubology</h1>

          <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="relative">
              <SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
