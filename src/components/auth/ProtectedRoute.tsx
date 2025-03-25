
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '../AuthForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, show auth form
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Authentication Required</h1>
        <p className="text-muted-foreground text-center mb-8">
          Please sign in or create an account to access this feature.
        </p>
        <AuthForm />
      </div>
    );
  }

  // If user is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
