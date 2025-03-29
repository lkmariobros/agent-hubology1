
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuthContext } from '@/context/auth';  // Updated import
import LoadingIndicator from '@/components/ui/loading-indicator';

const Index = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard');
      setIsRedirecting(true);
      const redirectTimeout = setTimeout(() => {
        navigate('/dashboard');
      }, 500); // Small delay to show redirect message
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthenticated, navigate]);

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
