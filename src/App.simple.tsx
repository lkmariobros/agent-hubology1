import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { NotificationProvider } from './context/NotificationContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dark } from "@clerk/themes";

// Import your pages
import Dashboard from './pages/Dashboard';
import SimpleAppLayout from './components/layout/SimpleAppLayout';
import SimpleAdminLayout from './components/layout/SimpleAdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

// Simple auth components
import SimpleSignIn from './components/auth/SimpleSignIn';
import SimpleSignUp from './components/auth/SimpleSignUp';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary:
                "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
              card: "bg-black/60 backdrop-blur-sm shadow-2xl border-none",
              formFieldLabel: "text-white",
              formFieldInput: "bg-gray-800 text-white border-gray-700",
              footerActionLink: "text-purple-400 hover:text-purple-300",
              headerTitle: "text-2xl font-bold text-white",
              headerSubtitle: "text-gray-400"
            }
          }}
        >
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/sign-in" />} />
                <Route path="/sign-in/*" element={<SimpleSignIn />} />
                <Route path="/sign-up/*" element={<SimpleSignUp />} />

                {/* Agent routes */}
                <Route path="/dashboard" element={
                  <SimpleAppLayout>
                    <Dashboard />
                  </SimpleAppLayout>
                } />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                  <SimpleAdminLayout>
                    <AdminDashboard />
                  </SimpleAdminLayout>
                } />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </NotificationProvider>
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
