
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AuthStateHandlerProps {
  children: React.ReactNode;
  loadingMessage?: string;
  errorFallback?: React.ReactNode;
  minimalUi?: boolean;
}

/**
 * Component that handles common authentication states (loading, error)
 * and only renders children when authentication is ready
 */
export const AuthStateHandler: React.FC<AuthStateHandlerProps> = ({
  children,
  loadingMessage = "Verifying authentication...",
  errorFallback,
  minimalUi = false
}) => {
  const { loading, error } = useAuth();
  
  const handleRetry = () => {
    window.location.reload();
  };

  // Show error state
  if (error && !loading) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }
    
    if (minimalUi) {
      return (
        <div className="p-4 w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error.message || "Failed to authenticate"}</AlertDescription>
            <Button onClick={handleRetry} variant="outline" size="sm" className="mt-2">
              Retry
            </Button>
          </Alert>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription className="mb-2">
              {error.message || "Failed to authenticate. Please try again."}
            </AlertDescription>
            <Button onClick={handleRetry} variant="outline" size="sm">
              Retry Authentication
            </Button>
          </Alert>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (loading) {
    if (minimalUi) {
      return <LoadingIndicator text={loadingMessage} size="sm" />;
    }
    
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator text={loadingMessage} size="md" />
      </div>
    );
  }
  
  // All good, render children
  return <>{children}</>;
};

export default AuthStateHandler;
