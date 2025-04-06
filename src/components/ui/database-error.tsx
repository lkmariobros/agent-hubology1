
import React from 'react';
import { AlertCircle, RefreshCw, Database, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface DatabaseErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHelp?: () => void;
  fullScreen?: boolean;
}

export const DatabaseError: React.FC<DatabaseErrorProps> = ({
  title = 'Database Connection Error',
  message = 'Failed to connect to the database. Please check your connection and try again.',
  onRetry,
  onHelp,
  fullScreen = false
}) => {
  // For full screen error display
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md w-full p-6 space-y-4 border-destructive/30 bg-destructive/5">
          <div className="flex flex-col items-center text-center">
            <Database className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
            {onRetry && (
              <Button variant="default" onClick={onRetry} className="flex gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            
            {onHelp && (
              <Button variant="outline" onClick={onHelp} className="flex gap-2">
                <HelpCircle className="h-4 w-4" />
                Get Help
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }
  
  // For inline error display
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-row items-center justify-between mt-2">
        <span>{message}</span>
        <div className="flex gap-2 mt-2">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          )}
          
          {onHelp && (
            <Button variant="ghost" size="sm" onClick={onHelp}>
              <HelpCircle className="h-3 w-3 mr-2" />
              Help
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseError;
