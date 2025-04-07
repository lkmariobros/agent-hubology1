import React, { useEffect } from 'react';
import SupabaseConnectionTest from '@/components/debug/SupabaseConnectionTest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Database, Server, ShieldCheck } from 'lucide-react';
import { ENV_STATUS } from '@/config/supabase';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

/**
 * Debug page for Supabase connection and authentication testing
 * Only available in development mode
 */
const SupabaseDebug: React.FC = () => {
  // Only show in development
  if (import.meta.env.PROD) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Debug tools are not available in production mode.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Set page title
  useEffect(() => {
    document.title = 'Supabase Debug | Agent Hubology';
    return () => {
      document.title = 'Agent Hubology';
    };
  }, []);

  return (
    <>

      <div className="container max-w-5xl py-10 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Supabase Debug Tools</h1>
          <p className="text-muted-foreground">
            Test and debug your Supabase connection and authentication.
          </p>
        </div>

        {!ENV_STATUS.USING_ENV_VARS && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Using Fallback Credentials</AlertTitle>
            <AlertDescription>
              You are using fallback Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="connection">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4 pt-4">
            <SupabaseConnectionTest />
          </TabsContent>

          <TabsContent value="auth" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Test</CardTitle>
                <CardDescription>
                  Test authentication functionality with Supabase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Current auth session:', supabase.auth.getSession());
                      supabase.auth.getSession().then(({ data, error }) => {
                        if (error) {
                          console.error('Error getting session:', error);
                          alert('Error getting session: ' + error.message);
                        } else {
                          console.log('Session data:', data);
                          alert(
                            data.session
                              ? `Logged in as: ${data.session.user.email}`
                              : 'No active session'
                          );
                        }
                      });
                    }}
                  >
                    Check Current Session
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      supabase.auth.signOut().then(({ error }) => {
                        if (error) {
                          console.error('Error signing out:', error);
                          alert('Error signing out: ' + error.message);
                        } else {
                          alert('Signed out successfully');
                        }
                      });
                    }}
                  >
                    Sign Out
                  </Button>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Authentication Testing</AlertTitle>
                  <AlertDescription>
                    Use the login page to test authentication. This page only provides basic session information.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Supabase Configuration</CardTitle>
                <CardDescription>
                  Current Supabase configuration details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Project URL:</div>
                    <div className="font-mono text-xs break-all">{supabase.supabaseUrl}</div>

                    <div className="font-medium">Using ENV Variables:</div>
                    <div>{ENV_STATUS.USING_ENV_VARS ? 'Yes' : 'No (using fallbacks)'}</div>

                    <div className="font-medium">Environment:</div>
                    <div>{import.meta.env.MODE}</div>

                    <div className="font-medium">Auth Storage Key:</div>
                    <div className="font-mono text-xs">{supabase.auth.storageKey}</div>
                  </div>

                  <Alert variant="default" className="bg-muted">
                    <AlertTitle>Environment Variables</AlertTitle>
                    <AlertDescription className="font-mono text-xs">
                      VITE_SUPABASE_URL={import.meta.env.VITE_SUPABASE_URL || '(not set)'}<br />
                      VITE_SUPABASE_ANON_KEY={(import.meta.env.VITE_SUPABASE_ANON_KEY ? '(set)' : '(not set)')}<br />
                      VITE_USE_REAL_DATA={import.meta.env.VITE_USE_REAL_DATA || '(not set)'}<br />
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SupabaseDebug;
