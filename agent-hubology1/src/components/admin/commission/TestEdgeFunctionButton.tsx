
import React from 'react';
import { Button } from '@/components/ui/button';
import { testEdgeFunctions } from '@/utils/testEdgeFunctions';
import { Loader2 } from 'lucide-react';

/**
 * A button component that runs tests on all Edge Functions
 * to verify they're working correctly
 */
export default function TestEdgeFunctionButton() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await testEdgeFunctions();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleClick} 
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      Test Edge Functions
    </Button>
  );
}
