import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AUTH_SETTINGS } from '@/config/supabase';

const Index = () => {
  const { isAuthenticated, loading, session, error } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [timeoutCount, setTimeoutCount] = useState(0);
  
  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Use a timeout to prevent getting stuck in loading state
  const timeoutRef = useRef<number | null>(null);
  
  // Monitor for auth state in development
  const logAuthState = () => {
    if (import.meta.env.DEV) {
      console.log('[IndexPage] Auth state:', { 
        isAuthenticated, 
        loading, 
        sessionExists: !!session,
        initialCheckDone,
        error: error?.message
      });
    }
  };
  
  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    logAuthState();
    
    // Set a timeout to avoid infinite loading state
    if (loading && !timeoutRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        if (isMounted.current && loading) {
          console.warn('[IndexPage] Auth check timed out, forcing initialCheckDone');
          setInitialCheckDone(true);
          setTimeoutCount(prev => prev + 1);
          toast.error('Authentication check timed out. Please try refreshing.');
        }
      }, AUTH_SETTINGS.AUTH_TIMEOUT);
    }
    
    // Clear timeout when loading completes
    if (!loading && timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Only redirect after the initial auth check is complete
    if (!loading && isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      navigate(AUTH_SETTINGS.REDIRECT_PATHS.AFTER_LOGIN);
    }
    
    // Mark initial check as done when loading is complete
    if (!loading && !initialCheckDone) {
      setInitialCheckDone(true);
    }
  }, [isAuthenticated, loading, navigate, initialCheckDone, session, error]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Show error with retry button if authentication check fails multiple times
  if ((error || timeoutCount > 1) && initialCheckDone) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-red-300">Authentication Error</AlertTitle>
            <AlertDescription className="text-red-300">
              {error?.message || "Authentication verification timed out repeatedly."}
            </AlertDescription>
          </Alert>
          
          <p className="text-white mb-4">
            This could be due to network issues, server problems, or browser settings. Try these options:
          </p>
          
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Check your internet connection</li>
            <li>Clear your browser cache and cookies</li>
            <li>Try using a different browser</li>
            <li>Disable any VPN or proxy services</li>
          </ul>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleRetry} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading indicator while checking authentication or redirecting
  if (loading || isRedirecting) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <LoadingIndicator 
          text={isRedirecting ? "Redirecting to dashboard..." : "Verifying authentication..."} 
          size="lg"
          className="text-white"
        />
        {loading && timeoutCount > 0 && (
          <Button
            variant="link"
            onClick={handleRetry}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            Taking too long? Click to retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default Index;
