
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  const { user, loading, isAuthenticated, isAdmin, hasRole } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <LoadingIndicator 
          fullScreen 
          size="lg" 
          text="Verifying authentication..." 
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check for admin requirement
  if (requireAdmin && !isAdmin) {
    console.log('[ProtectedRoute] Admin access required but user is not admin');
    return <Navigate to="/dashboard" replace />;
  }

  // Check for specific role requirements
  if (requireRoles.length > 0 && !requireRoles.some(role => hasRole(role))) {
    console.log('[ProtectedRoute] Required roles not found:', requireRoles);
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
