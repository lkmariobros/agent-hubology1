import React, { useEffect, useState } from 'react';
import SimpleDashboard from './pages/SimpleDashboard';
import App from './App';
import { useUser, useAuth, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// Import your original layouts and pages
import AppLayout from './components/layout/AppLayout';
import SimpleAppLayout from './components/layout/SimpleAppLayout';
import BasicLayout from './components/layout/BasicLayout';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import SimplifiedDashboard from './pages/SimplifiedDashboard';
import BasicDashboard from './pages/BasicDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileSetup from './pages/auth/ProfileSetup';
import JwtTest from './pages/auth/JwtTest';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode, requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false
}) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // Check if user has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        // Get token for Supabase
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          console.error('No token available');
          setIsChecking(false);
          return;
        }

        // Set the auth token for Supabase
        const { data: supabaseSession } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });

        // Check if profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile:', error);
          setIsChecking(false);
          return;
        }

        setHasProfile(!!data);
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [isLoaded, isSignedIn, user, getToken]);

  if (!isLoaded || isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // If user doesn't have a profile, redirect to profile setup
  if (!hasProfile) {
    return <Navigate to="/profile/setup" replace />;
  }

  // For now, we'll allow all signed-in users to access admin routes
  // In a real app, you'd check if the user has admin privileges
  return <>{children}</>;
};

const SimpleRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in/*" element={<App />} />
        <Route path="/sign-up/*" element={<App />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="/jwt-test" element={<JwtTest />} />

        {/* Protected agent routes */}
        <Route path="/dashboard" element={
          <BasicLayout>
            <Dashboard />
          </BasicLayout>
        } />

        {/* Protected admin routes */}
        <Route path="/admin/dashboard" element={
          <BasicLayout>
            <AdminDashboard />
          </BasicLayout>
        } />

        <Route path="/admin/*" element={
          <BasicLayout>
            <AdminDashboard />
          </BasicLayout>
        } />

        {/* Other routes */}
        <Route path="/properties" element={
          <BasicLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Properties</h1>
              <p>Properties page content will go here.</p>
            </div>
          </BasicLayout>
        } />

        <Route path="/transactions" element={
          <BasicLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Transactions</h1>
              <p>Transactions page content will go here.</p>
            </div>
          </BasicLayout>
        } />

        <Route path="/reports" element={
          <BasicLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Reports</h1>
              <p>Reports page content will go here.</p>
            </div>
          </BasicLayout>
        } />

        <Route path="/settings" element={
          <BasicLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              <p>Settings page content will go here.</p>
            </div>
          </BasicLayout>
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default SimpleRouter;
