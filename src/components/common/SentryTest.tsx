
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/sentry';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';

const SentryTest = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  
  // Function that deliberately throws an error
  const throwTestError = () => {
    try {
      // Throw a test error
      throw new Error('This is a test error for Sentry');
    } catch (error) {
      if (error instanceof Error) {
        // Capture the error with Sentry
        captureException(error, { source: 'SentryTest', test: true });
        
        // Show success toast
        toast.success('Test error sent to Sentry', {
          description: 'Check your Sentry dashboard to verify it was captured'
        });
        
        setTestResult('Error sent to Sentry. Check your dashboard.');
      }
    }
  };
  
  // Function to test breadcrumbs
  const addBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'User clicked the breadcrumb test button',
      level: 'info'
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
      username: 'testuser'
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
    <div className="p-6 border rounded-lg bg-background shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Sentry Integration Test</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Test if Sentry is correctly capturing errors by triggering a test error.
          </p>
          <Button 
            onClick={throwTestError} 
            variant="destructive"
          >
            Trigger Test Error
          </Button>
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
          <p className="font-medium">Note:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Sentry only captures errors in production mode</li>
            <li>In development mode, errors are only logged to the console</li>
            <li>Check your Sentry dashboard to verify error capture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SentryTest;
