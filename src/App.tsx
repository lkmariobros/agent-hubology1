
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

// Layout Components
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';

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
import Team from '@/pages/Team';
import Commission from '@/pages/Commission';

// Auth Pages
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Main Agent Portal - Use MainLayout instead of AppLayout */}
            <Route path="/" element={<MainLayout />}>
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/new" element={<NewProperty />} />
              <Route path="properties/:id" element={<PropertyDetail />} />
              <Route path="properties/:id/edit" element={<PropertyEdit />} />
              <Route path="properties/edit/:id" element={<PropertyEdit />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="team" element={<Team />} />
              <Route path="commission" element={<Commission />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Admin Portal */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              {/* Add other admin routes as needed */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
