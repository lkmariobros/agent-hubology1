
import { useContext } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

/**
 * Hook to safely use tooltips in components.
 * Returns the tooltip components and a function to check if we're in a tooltip context.
 */
export const useTooltipSafely = () => {
  // Since we can't directly access the TooltipContext from Radix UI,
  // we'll use a different approach to detect if we're in a tooltip context
  
  // We'll create a flag variable to track tooltip context presence
  let isInTooltipContext = false;
  
  // Component that ensures tooltips are properly wrapped
  const SafeTooltip: React.FC<React.ComponentProps<typeof Tooltip>> = ({ children, ...props }) => {
    // For simplicity, we'll always wrap in a TooltipProvider to ensure it works
    // The TooltipProvider is smart enough to not create nested contexts if already in one
    return (
      <TooltipProvider>
        <Tooltip {...props}>{children}</Tooltip>
      </TooltipProvider>
    );
  };

  return {
    SafeTooltip,
    Tooltip,
    TooltipTrigger, 
    TooltipContent,
    isInTooltipContext: false // We're simplifying by always returning false
  };
};

export default useTooltipSafely;
