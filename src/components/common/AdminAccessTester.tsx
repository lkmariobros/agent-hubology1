
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { isSpecialAdmin } from '@/utils/adminAccess';
import { Shield, Check, X, RefreshCw } from 'lucide-react';

/**
 * Component for testing the special admin access functionality
 * Only visible in development mode
 */
const AdminAccessTester: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<boolean | null>(null);
  
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }
  
  const handleTest = () => {
    const result = isSpecialAdmin(testEmail);
    setTestResult(result);
  };
  
  return (
    <div className="p-4 border rounded-lg bg-muted/30 max-w-md mx-auto my-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Admin Access Tester</h3>
      </div>
      
      <div className="mb-4 text-sm">
        <p>Current user: {user?.email || 'Not signed in'}</p>
        <p className="flex items-center gap-1 mt-1">
          Is admin: 
          {isAdmin ? (
            <Badge variant="default" className="bg-green-600">
              <Check className="h-3 w-3 mr-1" /> Yes
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-400 text-red-600">
              <X className="h-3 w-3 mr-1" /> No
            </Badge>
          )}
        </p>
      </div>
      
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Test an email address"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="text-sm"
        />
        <Button size="sm" onClick={handleTest}>
          Test
        </Button>
      </div>
      
      {testResult !== null && (
        <div className="text-sm">
          <p>
            Is special admin: {' '}
            {testResult ? (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" /> Yes
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-400 text-red-600">
                <X className="h-3 w-3 mr-1" /> No
              </Badge>
            )}
          </p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Special admin emails are configured in src/utils/adminAccess.ts</p>
      </div>
    </div>
  );
};

export default AdminAccessTester;
