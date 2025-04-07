import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Toaster } from './components/ui/sonner';

// Import layouts and pages
import BasicLayout from './components/layout/BasicLayout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileSetup from './pages/auth/ProfileSetup';
import App from './App'; // Original sign-in page

// Get Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA';

const FixedApp: React.FC = () => {
  return (
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
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
          <Route path="/sign-in/*" element={<App />} />
          <Route path="/sign-up/*" element={<App />} />
          <Route path="/profile/setup" element={<ProfileSetup />} />
          
          {/* Protected routes with BasicLayout */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <BasicLayout>
                  <Dashboard />
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <BasicLayout>
                  <AdminDashboard />
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          {/* Other routes */}
          <Route
            path="/properties"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Properties</h1>
                    <p>Properties page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/transactions"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Transactions</h1>
                    <p>Transactions page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/reports"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Reports</h1>
                    <p>Reports page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Settings</h1>
                    <p>Settings page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          {/* Admin routes */}
          <Route
            path="/admin/users"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
                    <p>Admin users page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/admin/properties"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Admin Properties</h1>
                    <p>Admin properties page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/admin/settings"
            element={
              <RequireAuth>
                <BasicLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
                    <p>Admin settings page content will go here.</p>
                  </div>
                </BasicLayout>
              </RequireAuth>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      
      <Toaster
        expand={false}
        visibleToasts={3}
        closeButton={true}
        richColors={true}
        position="top-right"
      />
    </ClerkProvider>
  );
};

// Simple auth wrapper component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default FixedApp;
