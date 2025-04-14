
import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyErrorStateProps {
  title: string;
  message: string;
  errorCode?: string | number;
  onRetry?: () => void;
}

const PropertyErrorState: React.FC<PropertyErrorStateProps> = ({ 
  title, 
  message, 
  errorCode, 
  onRetry 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6 pb-8 px-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
          
          {errorCode && (
            <div className="bg-muted py-2 px-3 rounded-md inline-block mb-6">
              <span className="text-sm font-mono">Error code: {errorCode}</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate('/properties')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Properties
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyErrorState;
