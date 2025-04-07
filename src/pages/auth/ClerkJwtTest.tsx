import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, createSupabaseWithToken } from '@/lib/supabase';

const ClerkJwtTest: React.FC = () => {
  const { isLoaded: authLoaded, userId, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any | null>(null);
  const [supabaseTest, setSupabaseTest] = useState<any | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testJwt = async () => {
    setIsLoading(true);
    setToken(null);
    setTokenError(null);
    setDecodedToken(null);
    setSupabaseTest(null);
    setSupabaseError(null);

    try {
      // Get JWT token
      console.log('Getting JWT token...');
      const jwt = await getToken({ template: 'supabase' });

      if (!jwt) {
        setTokenError('No token returned from Clerk');
        setIsLoading(false);
        return;
      }

      setToken(jwt);
      console.log('Got JWT token:', jwt);

      // Decode the token
      try {
        const parts = jwt.split('.');
        if (parts.length !== 3) {
          setTokenError('Invalid JWT format');
        } else {
          const decoded = JSON.parse(atob(parts[1]));
          setDecodedToken(decoded);
          console.log('Decoded token:', decoded);
        }
      } catch (decodeErr: any) {
        console.error('Error decoding token:', decodeErr);
        setTokenError(`Error decoding token: ${decodeErr.message}`);
      }

      // Test Supabase with token
      try {
        console.log('Creating Supabase client with JWT token...');
        const supabaseWithToken = createSupabaseWithToken(jwt);

        // Test a simple query
        console.log('Testing Supabase query with token...');
        const { data, error } = await supabaseWithToken
          .from('profiles')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Query error with token:', error);
          setSupabaseError(`Query error: ${error.message}`);
        } else {
          console.log('Query successful with token:', data);
          setSupabaseTest({
            success: true,
            data,
            message: 'Successfully queried Supabase with JWT token'
          });

          // Try to create a profile
          try {
            console.log('Testing profile creation with token...');
            const { data: insertData, error: insertError } = await supabaseWithToken
              .from('profiles')
              .upsert({
                clerk_id: userId || '',
                email: user?.primaryEmailAddress?.emailAddress || '',
                first_name: user?.firstName || '',
                last_name: user?.lastName || '',
                role: 'agent'
              })
              .select()
              .single();

            if (insertError) {
              console.error('Insert error with token:', insertError);
              setSupabaseError(`Insert error: ${insertError.message}`);
            } else {
              console.log('Insert successful with token:', insertData);
              setSupabaseTest({
                success: true,
                data: insertData,
                message: 'Successfully created profile in Supabase with JWT token'
              });
            }
          } catch (insertErr: any) {
            console.error('Exception inserting profile:', insertErr);
            setSupabaseError(`Insert exception: ${insertErr.message}`);
          }
        }
      } catch (supabaseErr: any) {
        console.error('Supabase error with token:', supabaseErr);
        setSupabaseError(`Supabase error: ${supabaseErr.message}`);
      }
    } catch (err: any) {
      console.error('Error getting token:', err);
      setTokenError(`Error getting token: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-3xl bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">Clerk JWT Token Test</CardTitle>
          <CardDescription className="text-gray-400">
            Testing Clerk JWT token generation and Supabase integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Authentication Status</h3>
            {!authLoaded || !userLoaded ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                <span>Loading auth state...</span>
              </div>
            ) : userId && user ? (
              <div className="bg-green-900/30 p-4 rounded-md">
                <p className="text-green-300">
                  Authenticated as {user?.firstName} {user?.lastName} ({user?.primaryEmailAddress?.emailAddress})
                </p>
                <p className="text-green-300 mt-2">User ID: {userId}</p>
              </div>
            ) : (
              <div className="bg-red-900/30 p-4 rounded-md">
                <p className="text-red-300">Not authenticated</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">JWT Token</h3>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                <span>Loading...</span>
              </div>
            ) : tokenError ? (
              <div className="bg-red-900/30 p-4 rounded-md">
                <p className="text-red-300">{tokenError}</p>
              </div>
            ) : token ? (
              <div className="bg-gray-700 p-4 rounded-md overflow-auto max-h-40">
                <pre className="text-xs text-green-300 whitespace-pre-wrap">{token}</pre>
              </div>
            ) : (
              <p className="text-gray-400">No token generated yet</p>
            )}
          </div>

          {decodedToken && (
            <div>
              <h3 className="text-lg font-medium mb-2">Decoded Token</h3>
              <div className="bg-gray-700 p-4 rounded-md overflow-auto max-h-40">
                <pre className="text-xs text-blue-300 whitespace-pre-wrap">
                  {JSON.stringify(decodedToken, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Supabase Test</h3>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                <span>Loading...</span>
              </div>
            ) : supabaseError ? (
              <div className="bg-red-900/30 p-4 rounded-md">
                <p className="text-red-300">{supabaseError}</p>
              </div>
            ) : supabaseTest ? (
              <div className="bg-green-900/30 p-4 rounded-md">
                <p className="text-green-300">{supabaseTest.message}</p>
                <div className="bg-gray-700 p-4 rounded-md mt-2 overflow-auto max-h-40">
                  <pre className="text-xs text-green-300 whitespace-pre-wrap">
                    {JSON.stringify(supabaseTest.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No Supabase test run yet</p>
            )}
          </div>

          <Button
            onClick={testJwt}
            disabled={isLoading || !authLoaded || !userLoaded || !userId}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              'Test JWT Token'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkJwtTest;
