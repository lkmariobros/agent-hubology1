import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase, createSupabaseWithToken } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JwtTest: React.FC = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<any | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [decodedToken, setDecodedToken] = useState<any | null>(null);

  const testJwt = async () => {
    setIsLoading(true);
    setToken(null);
    setTokenError(null);
    setSupabaseSession(null);
    setSessionError(null);
    setDecodedToken(null);

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

      // Test Supabase with direct token
      try {
        console.log('Creating Supabase client with JWT token...');
        const supabaseWithToken = createSupabaseWithToken(jwt);

        // Test a simple query with the token
        try {
          console.log('Testing Supabase query with token...');
          const { data: queryData, error: queryError } = await supabaseWithToken
            .from('profiles')
            .select('*')
            .limit(1);

          if (queryError) {
            console.error('Query error with token:', queryError);
            setSessionError(`Query error: ${queryError.message}`);
          } else {
            console.log('Query successful with token:', queryData);
            // Try to count profiles
            try {
              const { count, error: countError } = await supabaseWithToken
                .from('profiles')
                .select('*', { count: 'exact' });

              console.log('Profile count:', count);

              setSupabaseSession({
                user: { id: 'authenticated-with-token' },
                session: { access_token: jwt.substring(0, 10) + '...' },
                profileCount: count
              });
            } catch (countErr) {
              console.error('Error counting profiles:', countErr);
              setSupabaseSession({
                user: { id: 'authenticated-with-token' },
                session: { access_token: jwt.substring(0, 10) + '...' }
              });
            }
          }

          // Check if the profiles table exists by trying to select from it
          try {
            console.log('Checking if profiles table exists...');
            const { data: profilesData, error: profilesError } = await supabaseWithToken
              .from('profiles')
              .select('id')
              .limit(0);

            if (profilesError) {
              console.error('Error checking profiles table:', profilesError);
              console.log('Profiles table might not exist or you might not have access to it');
            } else {
              console.log('Profiles table exists and is accessible');
            }
          } catch (tablesErr) {
            console.error('Exception checking profiles table:', tablesErr);
          }

          // Try to create a profile directly
          try {
            console.log('Testing profile creation with token...');
            const { data: insertData, error: insertError } = await supabaseWithToken
              .from('profiles')
              .upsert({
                clerk_id: decodedToken?.sub || '',
                email: decodedToken?.user_email || '',
                first_name: '',
                last_name: '',
                role: 'agent'
              })
              .select()
              .single();

            if (insertError) {
              console.error('Insert error with token:', insertError);
              // Don't set session error, just log it
            } else {
              console.log('Insert successful with token:', insertData);
            }
          } catch (insertErr: any) {
            console.error('Exception in insert:', insertErr);
            // Don't set session error, just log it
          }
        } catch (queryErr: any) {
          console.error('Exception in query with token:', queryErr);
          setSessionError(`Query exception: ${queryErr.message}`);
        }
      } catch (tokenErr: any) {
        console.error('Exception creating client with token:', tokenErr);
        setSessionError(`Token client exception: ${tokenErr.message}`);
      }

      // Also try the original method for comparison
      try {
        console.log('Setting Supabase session (original method)...');
        const { data, error } = await supabase.auth.setSession({
          access_token: jwt,
          refresh_token: ''
        });

        if (error) {
          console.error('Supabase session error (original):', error);
          // Don't overwrite session error if we already have one from the token method
          if (!setSessionError) {
            setSessionError(`Original method error: ${error.message}`);
          }
        } else {
          console.log('Supabase session set successfully (original):', data);
          if (!supabaseSession) {
            setSupabaseSession(data);
          }
        }
      } catch (sessionErr: any) {
        console.error('Exception setting session (original):', sessionErr);
        // Don't overwrite session error if we already have one from the token method
        if (!sessionError) {
          setSessionError(`Original exception: ${sessionErr.message}`);
        }
      }
    } catch (err: any) {
      console.error('Error getting token:', err);
      setTokenError(`Error getting token: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testJwt();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-3xl bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">JWT Token Test</CardTitle>
          <CardDescription className="text-gray-400">
            Testing Clerk JWT token generation and Supabase integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <div className="bg-gray-700 p-4 rounded-md overflow-auto max-h-60">
                <pre className="text-xs text-blue-300 whitespace-pre-wrap">
                  {JSON.stringify(decodedToken, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Supabase Session</h3>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                <span>Loading...</span>
              </div>
            ) : sessionError ? (
              <div className="bg-red-900/30 p-4 rounded-md">
                <p className="text-red-300">{sessionError}</p>
              </div>
            ) : supabaseSession ? (
              <div className="bg-gray-700 p-4 rounded-md overflow-auto max-h-40">
                <pre className="text-xs text-green-300 whitespace-pre-wrap">
                  {JSON.stringify(supabaseSession, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-400">No session set yet</p>
            )}
          </div>

          <Button
            onClick={testJwt}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              'Test Again'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JwtTest;
