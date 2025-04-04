
import { useContext } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

/**
 * Hook to safely use tooltips in components.
 * Returns the tooltip components and a function to check if we're in a tooltip context.
 */
export const useTooltipSafely = () => {
  // Try to access tooltip context to check if we're already inside a provider
  let isInTooltipContext = false;
  
  try {
    // Checking for Provider context
    // This will throw if we're not inside a TooltipProvider
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(TooltipPrimitive.Provider.Context);
    isInTooltipContext = !!context;
  } catch (e) {
    isInTooltipContext = false;
  }

  // Component that ensures tooltips are properly wrapped
  const SafeTooltip: React.FC<React.ComponentProps<typeof Tooltip>> = ({ children, ...props }) => {
    if (isInTooltipContext) {
      return <Tooltip {...props}>{children}</Tooltip>;
    }
    
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
    isInTooltipContext
  };
};

export default useTooltipSafely;
