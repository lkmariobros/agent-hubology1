
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '@/components/ui/loading-indicator';

const Index = () => {
  const { isAuthenticated, loading, session } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    console.log('[IndexPage] Auth state:', { 
      isAuthenticated, 
      loading, 
      sessionExists: !!session,
      initialCheckDone
    });
    
    // Only redirect after the initial auth check is complete
    if (!loading && isAuthenticated && !isRedirecting) {
      console.log('[IndexPage] User authenticated, redirecting to dashboard');
      setIsRedirecting(true);
      navigate('/dashboard');
    }
    
    // Mark initial check as done when loading is false
    if (!loading && !initialCheckDone) {
      console.log('[IndexPage] Initial auth check completed');
      setInitialCheckDone(true);
    }
  }, [isAuthenticated, loading, navigate, initialCheckDone, session]);

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
