
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoadingIndicator from '../ui/loading-indicator';

interface AdminRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return <LoadingIndicator size="lg" text="Verifying admin access..." fullScreen />;
  }
  
  if (!isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;
