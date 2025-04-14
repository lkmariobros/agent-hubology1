import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ForceProfileSetup: React.FC = () => {
  const { user, profile } = useClerkAuth();
  const navigate = useNavigate();

  // Force navigation to profile setup
  useEffect(() => {
    // Clear any profile data from localStorage
    localStorage.removeItem('clerk-db-jwt');
    localStorage.removeItem('clerk-db-user');
    localStorage.removeItem('clerk-db-session');
    localStorage.removeItem('clerk-db-org');
    
    // Add a small delay to ensure localStorage is cleared
    const timer = setTimeout(() => {
      navigate('/profile/setup');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">Redirecting to Profile Setup</CardTitle>
          <CardDescription className="text-gray-400">
            Clearing session data and redirecting...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
          
          <p className="text-center text-gray-300">
            You will be redirected to the profile setup page in a moment.
          </p>
          
          <Button
            onClick={() => navigate('/profile/setup')}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Go to Profile Setup Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForceProfileSetup;
