
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';  // Updated import
import LoadingIndicator from '../ui/loading-indicator';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireRoles = [],
  redirectTo = '/' 
}) => {
  const { user, loading, isAdmin, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingIndicator fullScreen size="lg" text="Verifying authentication..." />;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireRoles.length > 0 && !requireRoles.some(role => hasRole(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
