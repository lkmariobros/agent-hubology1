import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import AuthProvider from './context/auth/AuthProvider';
import ErrorBoundary from './components/common/ErrorBoundary';

// Import layouts and pages
import BasicLayout from './components/layout/BasicLayout';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Commission from './pages/Commission';
import Opportunities from './pages/Opportunities';
import Leaderboard from './pages/leaderboard/Leaderboard';
import NotificationsTest from './pages/NotificationsTest'; // Import the new NotificationsTest page
import StorageTest from './pages/StorageTest'; // Import the StorageTest page
import NewProperty from './pages/NewProperty';
import NewTransaction from './pages/NewTransaction';
import PropertyDetail from './pages/PropertyDetail';
import TransactionDetail from './pages/TransactionDetail';

// Import the new Clerk-specific pages
import ClerkNewProperty from './pages/ClerkNewProperty';
import ClerkNewTransaction from './pages/ClerkNewTransaction';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/Properties';
import AdminTransactions from './pages/admin/Transactions';
import AdminSettings from './pages/admin/Settings';
import AdminAgents from './pages/admin/Agents';
import CommissionApproval from './pages/admin/CommissionApproval';

// Auth pages
import ProfileSetup from './pages/auth/ProfileSetup';
import JwtTest from './pages/auth/JwtTest';
import ClerkJwtTest from './pages/auth/ClerkJwtTest';
import BasicAuthTest from './pages/auth/BasicAuthTest';
import App from './App'; // Original sign-in page

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Get Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA';

const FixedApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ClerkProviderWithFallbacks>
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/sign-in" replace />} />
              <Route path="/sign-in/*" element={<App />} />
              <Route path="/sign-up/*" element={<App />} />
              <Route path="/profile/setup" element={<ProfileSetup />} />
              <Route path="/jwt-test" element={<JwtTest />} />
              <Route path="/clerk-jwt-test" element={<ClerkJwtTest />} />
              <Route path="/basic-auth-test" element={<BasicAuthTest />} />

              {/* Protected routes with MainLayout */}
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              {/* Other routes */}
              <Route
                path="/properties"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Properties />
                    </MainLayout>
                  </RequireAuth>
                }
              />
              
              {/* Redirect route from old to new property form */}
              <Route
                path="/properties/new"
                element={<Navigate to="/clerk-properties/new" replace />}
              />
              
              {/* New Property route - under a new path */}
              <Route
                path="/clerk-properties/new"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <ClerkNewProperty />
                    </MainLayout>
                  </RequireAuth>
                }
              />
              
              {/* Property Detail route with ID parameter */}
              <Route
                path="/properties/:id"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <PropertyDetail />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/transactions"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Transactions />
                    </MainLayout>
                  </RequireAuth>
                }
              />
              
              {/* Redirect route from old to new transaction form */}
              <Route
                path="/transactions/new"
                element={<Navigate to="/clerk-transactions/new" replace />}
              />
              
              {/* New Transaction route - under a new path */}
              <Route
                path="/clerk-transactions/new"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <ClerkNewTransaction />
                    </MainLayout>
                  </RequireAuth>
                }
              />
              
              {/* Transaction Detail route with ID parameter */}
              <Route
                path="/transactions/:id"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <TransactionDetail />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/reports"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Reports />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/team"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Team />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/commission"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Commission />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/opportunities"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Opportunities />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Leaderboard />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              {/* Notifications Test Route */}
              <Route
                path="/notifications-test"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <NotificationsTest />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              {/* Storage Test Route */}
              <Route
                path="/storage-test"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <StorageTest />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/users"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AdminAgents />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/admin/commission-approval"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <CommissionApproval />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/admin/properties"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AdminProperties />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AdminSettings />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/admin/transactions"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AdminTransactions />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster
              expand={false}
              visibleToasts={3}
              closeButton={true}
              richColors={true}
              position="top-right"
            />
            </AuthProvider>
          </BrowserRouter>
          </TooltipProvider>
        </ClerkProviderWithFallbacks>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Simple auth wrapper component with error boundary
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <p className="mb-4">There was an error while authenticating your session.</p>
            <div className="flex justify-between">
              <button
                onClick={() => window.location.href = '/sign-in'}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Return to Sign In
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      }
    >
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ErrorBoundary>
  );
};

// ClerkProviderWithFallbacks component to handle Clerk errors gracefully
const ClerkProviderWithFallbacks: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Authentication Service Error</h2>
            <p className="mb-4">We're having trouble connecting to our authentication service.</p>
            <div className="flex justify-between">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      }
    >
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        appearance={{
          elements: {
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
            card: "bg-black/60 backdrop-blur-sm shadow-2xl border-none",
            formFieldLabel: "text-white",
            formFieldInput: "bg-gray-800 text-white border-gray-700",
            footerActionLink: "text-purple-400 hover:text-purple-300",
            headerTitle: "text-2xl font-bold text-white",
            headerSubtitle: "text-gray-400"
          }
        }}
      >
        {children}
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default FixedApp;
