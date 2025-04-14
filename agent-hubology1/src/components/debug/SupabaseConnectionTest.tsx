import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

/**
 * A debug component to test Supabase connection
 * Only use this component during development
 */
export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supabaseInfo, setSupabaseInfo] = useState<{
    url: string;
    usingEnvVars: boolean;
  }>({
    url: supabase.supabaseUrl,
    usingEnvVars: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
  });

  const testConnection = async () => {
    setConnectionStatus('testing');
    setErrorMessage(null);
    
    try {
      // Simple query to test the connection
      const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact' }).limit(0);
      
      if (error) {
        throw error;
      }
      
      setConnectionStatus('success');
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  useEffect(() => {
    // Auto-test on mount if in development
    if (import.meta.env.DEV) {
      testConnection();
    }
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Supabase Connection Test
          {connectionStatus === 'success' && <CheckCircle2 className="text-green-500 h-5 w-5" />}
          {connectionStatus === 'error' && <XCircle className="text-red-500 h-5 w-5" />}
        </CardTitle>
        <CardDescription>
          Test your connection to Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionStatus === 'testing' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Testing Connection</AlertTitle>
            <AlertDescription>
              Attempting to connect to Supabase...
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'success' && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Connection Successful</AlertTitle>
            <AlertDescription>
              Successfully connected to Supabase!
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {errorMessage || 'Failed to connect to Supabase.'}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm space-y-2 border rounded-md p-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supabase URL:</span>
            <span className="font-mono text-xs truncate max-w-[200px]">{supabaseInfo.url}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Using ENV Variables:</span>
            <span>{supabaseInfo.usingEnvVars ? 'Yes' : 'No (using fallbacks)'}</span>
          </div>
        </div>
        
        {!supabaseInfo.usingEnvVars && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Using Fallback Credentials</AlertTitle>
            <AlertDescription>
              You are using fallback Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={testConnection} 
          disabled={connectionStatus === 'testing'}
          className="w-full"
        >
          {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SupabaseConnectionTest;
