import React, { ReactNode } from 'react';
import { useAuth, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LoadingIndicator from '../ui/loading-indicator';

interface SimpleProtectedRouteProps {
  children: ReactNode;
}

const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({ children }) => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <LoadingIndicator 
          fullScreen 
          size="lg" 
          text="Loading..." 
        />
      </div>
    );
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default SimpleProtectedRoute;
