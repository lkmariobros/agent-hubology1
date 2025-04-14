import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase, createSupabaseWithToken } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

const ProfileSetup: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { createUserProfile } = useClerkAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('agent');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('ProfileSetup: Form submitted');

    if (!user) {
      console.error('ProfileSetup: No user object available');
      toast.error('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      // Get token for Supabase
      console.log('ProfileSetup: Getting JWT token for profile creation...');
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('ProfileSetup: No token available for profile creation');
        throw new Error('No token available');
      }

      console.log('ProfileSetup: Got JWT token for profile creation:', token.substring(0, 20) + '...');

      // Create a Supabase client with the JWT token
      console.log('ProfileSetup: Creating Supabase client with JWT token for profile creation...');
      const supabaseWithToken = createSupabaseWithToken(token);

      // Create profile using RPC function
      console.log('ProfileSetup: Creating profile with params:', {
        p_clerk_id: user.id,
        p_email: user.primaryEmailAddress?.emailAddress,
        p_first_name: user.firstName,
        p_last_name: user.lastName,
        p_role: role
      });

      let profileData = null;

      // Use the RPC function to create or update the profile
      console.log('ProfileSetup: Using RPC function to create/update profile');
      const { data, error: createError } = await supabaseWithToken
        .rpc('create_profile_for_clerk_user', {
          p_clerk_id: user.id,
          p_email: user.primaryEmailAddress?.emailAddress || '',
          p_first_name: user.firstName || '',
          p_last_name: user.lastName || '',
          p_role: role
        });

      if (createError) {
        console.error('ProfileSetup: Error creating profile via RPC:', createError);
        throw new Error(createError.message);
      }

      console.log('ProfileSetup: Profile created successfully via RPC:', data);
      profileData = data;

      toast.success('Profile created successfully!');

      // Redirect based on role
      if (profileData?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('ProfileSetup: General error in form submission:', error);
      toast.error(`Failed to create profile: ${error.message || 'Unknown error'}`);

      // If profile creation fails, check if profile already exists
      try {
        console.log('ProfileSetup: Checking if profile already exists');
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          throw new Error('No token available');
        }

        const supabaseWithToken = createSupabaseWithToken(token);
        const { data: existingData, error: fetchError } = await supabaseWithToken
          .rpc('get_profile_by_clerk_id', { p_clerk_id: user.id });

        if (fetchError) {
          console.error('ProfileSetup: Error fetching existing profile:', fetchError);
          throw error; // Throw the original error
        }

        if (existingData && existingData.length > 0) {
          console.log('ProfileSetup: Found existing profile:', existingData[0]);
          toast.success('Using existing profile');

          // Redirect based on role
          if (existingData[0]?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (checkErr) {
        console.error('ProfileSetup: Error checking existing profile:', checkErr);
        // We already showed the original error, so just log this one
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-sm shadow-2xl border-none">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-400">
            Set up your profile to continue to the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                value={user?.primaryEmailAddress?.emailAddress || ''}
                disabled
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                disabled
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
              >
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </>
              ) : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
