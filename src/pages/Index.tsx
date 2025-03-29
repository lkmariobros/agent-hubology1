
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, loading, session, error } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  
  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Use a timeout to prevent getting stuck in loading state
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    console.log('[IndexPage] Auth state:', { 
      isAuthenticated, 
      loading, 
      sessionExists: !!session,
      initialCheckDone,
      error: error?.message
    });
    
    // Set a timeout to avoid infinite loading state
    if (loading && !timeoutRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        if (isMounted.current && loading) {
          console.warn('[IndexPage] Auth check timed out, forcing initialCheckDone');
          setInitialCheckDone(true);
          toast.error('Authentication check timed out. Please try refreshing.');
        }
      }, 8000); // 8 seconds timeout
    }
    
    // Clear timeout when loading completes
    if (!loading && timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Only redirect after the initial auth check is complete
    if (!loading && isAuthenticated && !isRedirecting) {
      console.log('[IndexPage] User authenticated, redirecting to dashboard');
      setIsRedirecting(true);
      navigate('/dashboard');
    }
    
    // Mark initial check as done when loading is complete
    if (!loading && !initialCheckDone) {
      console.log('[IndexPage] Initial auth check completed');
      setInitialCheckDone(true);
    }
  }, [isAuthenticated, loading, navigate, initialCheckDone, session, error]);

  // Show error if authentication check fails
  if (error && initialCheckDone) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl text-red-400 font-bold mb-4">Authentication Error</h2>
          <p className="text-white mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Refresh Page
          </button>
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
