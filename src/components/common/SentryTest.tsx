
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/sentry';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SentryTest = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [sentryStatus, setSentryStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  
  // Check Sentry initialization on component mount
  useEffect(() => {
    const isSentryInitialized = Sentry.getCurrentHub().getClient() !== undefined;
    if (isSentryInitialized) {
      setSentryStatus('success');
      console.log('Sentry is properly initialized');
    } else {
      setSentryStatus('error');
      console.log('Sentry is NOT properly initialized');
    }
  }, []);
  
  // Function that deliberately throws an error
  const throwTestError = () => {
    try {
      // Throw a test error
      throw new Error('This is a test error for Sentry from PropertyDetail page');
    } catch (error) {
      if (error instanceof Error) {
        // Capture the error with Sentry
        captureException(error, { 
          source: 'SentryTest', 
          test: true, 
          location: 'PropertyDetail page',
          timestamp: new Date().toISOString()
        });
        
        // Show success toast
        toast.success('Test error sent to Sentry', {
          description: 'Check your Sentry dashboard to verify it was captured'
        });
        
        setTestResult(`Error sent to Sentry: "${error.message}". Check your dashboard in a few moments.`);
      }
    }
  };
  
  // Function to test unhandled error
  const throwUnhandledError = () => {
    // This will throw an unhandled error that should be caught by Sentry's global handler
    setTimeout(() => {
      // @ts-ignore - intentionally accessing undefined property
      const obj = null;
      obj.nonExistentMethod();
    }, 100);
    
    toast.info('Unhandled error triggered', {
      description: 'This should be automatically captured by Sentry'
    });
  };
  
  // Function to test breadcrumbs
  const addBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'User clicked the breadcrumb test button',
      level: 'info',
      data: {
        timestamp: new Date().toISOString(),
        page: 'PropertyDetail'
      }
    });
    
    toast.info('Breadcrumb added to Sentry', {
      description: 'This will be attached to the next error'
    });
    
    setTestResult('Breadcrumb added. Now trigger an error to see it in context.');
  };
  
  // Function to test user context
  const setUserContext = () => {
    Sentry.setUser({ 
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser',
      ip_address: '127.0.0.1'
    });
    
    toast.info('User context set in Sentry', {
      description: 'User information will be attached to errors'
    });
    
    setTestResult('User context set. Trigger an error to see it in context.');
  };
  
  // Function to clear user context
  const clearUserContext = () => {
    Sentry.setUser(null);
    
    toast.info('User context cleared from Sentry');
    
    setTestResult('User context cleared.');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>Sentry Integration Test</span>
          {sentryStatus === 'success' && (
            <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
          )}
          {sentryStatus === 'error' && (
            <XCircle className="ml-2 h-5 w-5 text-red-500" />
          )}
          {sentryStatus === 'unknown' && (
            <InfoIcon className="ml-2 h-5 w-5 text-yellow-500" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {sentryStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Sentry Not Initialized</AlertTitle>
            <AlertDescription>
              Sentry does not appear to be properly initialized. Check your configuration.
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Test if Sentry is correctly capturing errors by triggering a test error.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={throwTestError} 
              variant="destructive"
            >
              Trigger Test Error
            </Button>
            <Button 
              onClick={throwUnhandledError}
              variant="destructive"
            >
              Trigger Unhandled Error
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={addBreadcrumb} variant="outline">
            Add Breadcrumb
          </Button>
          
          <Button onClick={setUserContext} variant="outline">
            Set User Context
          </Button>
          
          <Button onClick={clearUserContext} variant="outline">
            Clear User Context
          </Button>
        </div>
        
        {testResult && (
          <div className="p-4 bg-muted rounded-md">
            <p className="font-mono text-sm">{testResult}</p>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Troubleshooting Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>It may take a few moments for errors to appear in your dashboard</li>
            <li>Verify your Sentry project DSN is correct in the configuration</li>
            <li>Check your browser console for any Sentry-related errors</li>
            <li>Network tab in developer tools will show if data is being sent to Sentry</li>
            <li>Try turning off ad blockers or privacy extensions that might block Sentry</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentryTest;
