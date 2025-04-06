
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface QueryErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const QueryError: React.FC<QueryErrorProps> = ({ 
  title,
  message, 
  onRetry 
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-row items-center justify-between">
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p>{message}</p>
        </div>
        {onRetry && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRetry} 
            className="ml-4 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default QueryError;
