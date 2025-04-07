import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfileSetupTest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Setup Test</CardTitle>
          <CardDescription className="text-gray-400">
            Testing the profile setup page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            This page helps test if the profile setup page is working correctly.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/profile/setup')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Profile Setup
            </Button>
            
            <Button
              onClick={() => navigate('/jwt-test')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to JWT Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetupTest;
