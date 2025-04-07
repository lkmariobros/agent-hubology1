import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DirectTest: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">Direct Test Page</CardTitle>
          <CardDescription className="text-gray-400">
            Testing authentication and profile setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            This page provides direct links to test various authentication and profile setup pages.
          </p>

          <div className="space-y-4">
            <Link to="/profile/setup">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Go to Profile Setup
              </Button>
            </Link>

            <Link to="/force-profile-setup">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Force Profile Setup (Clear Session)
              </Button>
            </Link>

            <Link to="/jwt-test">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Go to JWT Test
              </Button>
            </Link>

            <Link to="/clerk-jwt-test">
              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                Go to Clerk JWT Test
              </Button>
            </Link>

            <Link to="/auth-test">
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                Go to Auth Test
              </Button>
            </Link>

            <Link to="/sign-in">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Sign In
              </Button>
            </Link>

            <Link to="/sign-out">
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Clear any local storage or session data
                  localStorage.clear();
                  sessionStorage.clear();
                }}
              >
                Sign Out (Clear Storage)
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectTest;
