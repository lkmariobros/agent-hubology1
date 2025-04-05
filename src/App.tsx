
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';

// Components
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import NewProperty from '@/pages/NewProperty';
import PropertyEdit from '@/pages/PropertyEdit';
import PropertyDetail from '@/pages/PropertyDetail';
import Transactions from '@/pages/Transactions';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

// Auth Pages
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="properties" element={<Properties />} />
                <Route path="properties/new" element={<NewProperty />} />
                <Route path="properties/:id" element={<PropertyDetail />} />
                <Route path="properties/:id/edit" element={<PropertyEdit />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
