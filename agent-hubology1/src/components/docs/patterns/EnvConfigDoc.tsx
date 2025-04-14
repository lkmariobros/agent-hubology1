
import React from 'react';
import { ComponentDoc } from '../ComponentDoc';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import EnvStatusBanner from '@/components/common/EnvStatusBanner';

export function EnvConfigDoc() {
  return (
    <ComponentDoc
      title="Environment Configuration Pattern"
      description="Best practices for managing environment variables and configuration across different deployment environments."
      status="stable"
      critical={true}
      examples={[
        {
          title: "Environment Validation",
          code: `// Validate environment variables
export function validateEnvironment(): boolean {
  if (import.meta.env.PROD) {
    const missingVars = [];
    
    if (!import.meta.env.VITE_SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');
    
    if (missingVars.length > 0) {
      console.error(\`Missing required environment variables: \${missingVars.join(', ')}\`);
      return false;
    }
  }
  
  return true;
}`,
        },
        {
          title: "Environment Status Banner",
          code: `const EnvStatusBanner = () => {
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }
  
  // Only show if using fallback values
  if (ENV_STATUS.USING_ENV_VARS) {
    return null;
  }
  
  return (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Development Mode</AlertTitle>
      <AlertDescription>
        Using fallback Supabase credentials. For production, 
        set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
      </AlertDescription>
    </Alert>
  );
};`,
        }
      ]}
      notes="Environment configuration is critical for maintaining security and proper operation across different deployment environments. Never commit sensitive values to source control. Use environment variables for all configuration values that change between environments."
      seeAlso={["Supabase Integration", "Authentication System"]}
    >
      <div className="space-y-4 my-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Warning</AlertTitle>
          <AlertDescription>
            Never commit real API keys or secrets to the codebase. Always use environment variables for sensitive information.
          </AlertDescription>
        </Alert>
        
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Environment Status Banner Example</h3>
          <EnvStatusBanner />
          <p className="text-sm text-muted-foreground mt-2">
            This banner will only appear in development mode when using fallback credentials.
          </p>
        </div>
      </div>
    </ComponentDoc>
  );
}

export default EnvConfigDoc;
