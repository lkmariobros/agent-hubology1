import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase, createSupabaseWithToken } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProfileSetupFlow from '@/components/profile/ProfileSetupFlow';

const ProfileSetup: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Check if profile already exists
  useEffect(() => {
    const checkProfile = async () => {
      console.log('ProfileSetup: Starting profile check');
      console.log('User object:', user);

      if (!user) {
        console.log('ProfileSetup: No user object available yet');
        return;
      }

      try {
        setIsChecking(true);

        // Get token for Supabase
        console.log('ProfileSetup: Getting JWT token...');
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          console.error('ProfileSetup: No token available');
          setIsChecking(false);
          return;
        }

        console.log('ProfileSetup: Got JWT token:', token.substring(0, 20) + '...');

        // Create a Supabase client with the JWT token
        console.log('ProfileSetup: Creating Supabase client with JWT token...');
        const supabaseWithToken = createSupabaseWithToken(token);

        // Check if profile exists using the token-authenticated client
        console.log('ProfileSetup: Checking if profile exists for clerk_id:', user.id);
        try {
          // Use the RPC function to check if profile exists
          const { data, error } = await supabaseWithToken
            .rpc('get_profile_by_clerk_id', { p_clerk_id: user.id });

          if (error) {
            console.error('ProfileSetup: Error checking profile:', error);
            setIsChecking(false);
            return;
          }

          console.log('ProfileSetup: Profile check result:', data);

          if (data && data.length > 0) {
            setProfileExists(true);
            // Redirect based on role
            if (data[0].role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/dashboard');
            }
          } else {
            console.log('ProfileSetup: No profile found, showing setup form');
          }
        } catch (profileErr) {
          console.error('ProfileSetup: Exception checking profile:', profileErr);
          setIsChecking(false);
          return;
        }

        setIsChecking(false);
      } catch (error: any) {
        console.error('ProfileSetup: General error:', error);
        setCheckError(error.message || 'Unknown error checking profile');
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [user, getToken, navigate]);



  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking profile status...</p>
        </div>
      </div>
    );
  }

  if (checkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-sm shadow-2xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">!</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Error Checking Profile</CardTitle>
            <CardDescription className="text-gray-400">
              There was an error checking your profile status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-900/30 p-4 rounded-md mb-4">
              <p className="text-red-300 text-sm">{checkError}</p>
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <p className="text-white text-lg">Profile exists. Redirecting...</p>
        </div>
      </div>
    );
  }

  // If no profile exists, show the ProfileSetupFlow component
  return <ProfileSetupFlow />;
};

export default ProfileSetup;
