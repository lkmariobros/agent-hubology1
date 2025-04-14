
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ENV_STATUS } from '@/config/supabase';

/**
 * Component that shows environment status information
 * Only visible in development mode
 */
const EnvStatusBanner = () => {
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }
  
  // Only show if using fallback values
  if (ENV_STATUS.USING_ENV_VARS) {
    return null;
  }
  
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Development Mode</AlertTitle>
      <AlertDescription>
        Using fallback Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
      </AlertDescription>
    </Alert>
  );
};

export default EnvStatusBanner;
