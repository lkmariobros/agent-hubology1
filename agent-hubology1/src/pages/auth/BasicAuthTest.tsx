import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { createSupabaseClient } from '@/lib/supabaseWithClerk';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

const BasicAuthTest = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [supabaseAnonymousTest, setSupabaseAnonymousTest] = useState<{ success: boolean; message: string; data?: any }>({
    success: false,
    message: 'Not tested yet'
  });
  const [supabaseAuthTest, setSupabaseAuthTest] = useState<{ success: boolean; message: string; data?: any }>({
    success: false,
    message: 'Not tested yet'
  });
  const [loading, setLoading] = useState({
    token: false,
    anonymousTest: false,
    authTest: false
  });

  // Get JWT token when component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchToken();
    }
  }, [isSignedIn]);

  const fetchToken = async () => {
    try {
      setLoading(prev => ({ ...prev, token: true }));
      const jwt = await getToken({ template: 'supabase' });
      setToken(jwt);

      if (jwt) {
        // Decode the JWT to show its contents
        const parts = jwt.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setDecodedToken(payload);
        }
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    } finally {
      setLoading(prev => ({ ...prev, token: false }));
    }
  };

  const testAnonymousSupabase = async () => {
    try {
      setLoading(prev => ({ ...prev, anonymousTest: true }));

      // Test anonymous access to Supabase
      const { data, error } = await supabase.rpc('get_server_timestamp');

      if (error) {
        setSupabaseAnonymousTest({
          success: false,
          message: `Error: ${error.message}`
        });
      } else {
        setSupabaseAnonymousTest({
          success: true,
          message: 'Successfully connected to Supabase anonymously',
          data
        });
      }
    } catch (error: any) {
      setSupabaseAnonymousTest({
        success: false,
        message: `Exception: ${error.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, anonymousTest: false }));
    }
  };

  const testAuthenticatedSupabase = async () => {
    if (!token) {
      setSupabaseAuthTest({
        success: false,
        message: 'No JWT token available. Please fetch token first.'
      });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, authTest: true }));

      // Create a Supabase client with the JWT token
      const supabaseWithAuth = createSupabaseClient(token);

      // Test authenticated access to Supabase
      const { data, error } = await supabaseWithAuth.rpc('get_auth_info');

      if (error) {
        setSupabaseAuthTest({
          success: false,
          message: `Error: ${error.message}`
        });
      } else {
        setSupabaseAuthTest({
          success: true,
          message: 'Successfully authenticated with Supabase',
          data
        });
      }
    } catch (error: any) {
      setSupabaseAuthTest({
        success: false,
        message: `Exception: ${error.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, authTest: false }));
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user authentication information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Signed In:</span>
                {isSignedIn ? (
                  <span className="flex items-center text-green-500">
                    <CheckCircle className="h-5 w-5 mr-1" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <XCircle className="h-5 w-5 mr-1" /> No
                  </span>
                )}
              </div>

              {isSignedIn && user && (
                <>
                  <div>
                    <span className="font-semibold">User ID:</span> {user.id}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {user.primaryEmailAddress?.emailAddress}
                  </div>
                  <div>
                    <span className="font-semibold">Name:</span> {user.fullName || 'Not provided'}
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {!isSignedIn && (
              <Button asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
            )}
            {isSignedIn && (
              <Button variant="outline" onClick={() => window.location.href = '/sign-out'}>
                Sign Out
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {isSignedIn && (
        <Tabs defaultValue="jwt" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jwt">JWT Token</TabsTrigger>
            <TabsTrigger value="supabase">Supabase Tests</TabsTrigger>
            <TabsTrigger value="other">Other Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="jwt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>JWT Token</CardTitle>
                <CardDescription>Your JWT token for Supabase authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={fetchToken}
                    disabled={loading.token}
                    className="mb-4"
                  >
                    {loading.token ? 'Fetching...' : 'Refresh Token'}
                  </Button>

                  {token ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Token:</h3>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                          <code className="text-xs break-all">{token}</code>
                        </div>
                      </div>

                      {decodedToken && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Decoded Token:</h3>
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                            <pre className="text-xs">{JSON.stringify(decodedToken, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No Token</AlertTitle>
                      <AlertDescription>
                        No JWT token available. Click "Refresh Token" to generate one.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supabase" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Supabase Connection Tests</CardTitle>
                <CardDescription>Test your connection to Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Anonymous Access Test</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Tests if you can connect to Supabase without authentication
                    </p>
                    <Button
                      onClick={testAnonymousSupabase}
                      disabled={loading.anonymousTest}
                      className="mb-3"
                    >
                      {loading.anonymousTest ? 'Testing...' : 'Test Anonymous Access'}
                    </Button>

                    {supabaseAnonymousTest.message !== 'Not tested yet' && (
                      <Alert variant={supabaseAnonymousTest.success ? "default" : "destructive"}>
                        {supabaseAnonymousTest.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {supabaseAnonymousTest.success ? 'Success' : 'Error'}
                        </AlertTitle>
                        <AlertDescription>
                          {supabaseAnonymousTest.message}
                          {supabaseAnonymousTest.data && (
                            <div className="mt-2">
                              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {JSON.stringify(supabaseAnonymousTest.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Authenticated Access Test</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Tests if you can connect to Supabase with JWT authentication
                    </p>
                    <Button
                      onClick={testAuthenticatedSupabase}
                      disabled={loading.authTest || !token}
                      className="mb-3"
                    >
                      {loading.authTest ? 'Testing...' : 'Test Authenticated Access'}
                    </Button>

                    {supabaseAuthTest.message !== 'Not tested yet' && (
                      <Alert variant={supabaseAuthTest.success ? "default" : "destructive"}>
                        {supabaseAuthTest.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {supabaseAuthTest.success ? 'Success' : 'Error'}
                        </AlertTitle>
                        <AlertDescription>
                          {supabaseAuthTest.message}
                          {supabaseAuthTest.data && (
                            <div className="mt-2">
                              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {JSON.stringify(supabaseAuthTest.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other">
            <Card>
              <CardHeader>
                <CardTitle>Other Authentication Tests</CardTitle>
                <CardDescription>Additional authentication test pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">JWT Test Page</h3>
                      <p className="text-sm text-gray-500">Basic JWT token test page</p>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/jwt-test" className="flex items-center">
                        Visit <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Clerk JWT Test</h3>
                      <p className="text-sm text-gray-500">Test Clerk JWT token generation</p>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/clerk-jwt-test" className="flex items-center">
                        Visit <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Dashboard</h3>
                      <p className="text-sm text-gray-500">Protected dashboard page</p>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/dashboard" className="flex items-center">
                        Visit <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>SQL Functions for Testing</CardTitle>
            <CardDescription>Run these SQL functions in your Supabase project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Anonymous Test Function</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                  <pre className="text-xs">
{`-- Create a function that returns the server timestamp
-- This can be called without authentication
CREATE OR REPLACE FUNCTION public.get_server_timestamp()
RETURNS TIMESTAMPTZ
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;

-- Grant access to all users
GRANT EXECUTE ON FUNCTION public.get_server_timestamp() TO anon, authenticated;`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Authentication Test Function</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                  <pre className="text-xs">
{`-- Create a function that returns authentication information
-- This requires authentication
CREATE OR REPLACE FUNCTION public.get_auth_info()
RETURNS JSONB
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'user_id', auth.uid(),
    'jwt_claims', auth.jwt(),
    'role', current_user,
    'session', current_setting('request.jwt.claims', true)::jsonb
  );
$$;

-- Grant access to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_auth_info() TO authenticated;`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BasicAuthTest;