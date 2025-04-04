
import React from 'react';
import { TooltipProvider } from './tooltip';

type TooltipWrapperProps = {
  children: React.ReactNode;
};

/**
 * A utility component that ensures tooltips have the required provider context.
 * Use this to wrap components that use tooltips when you're not sure if they'll
 * be rendered within a TooltipProvider.
 */
export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ children }) => {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  );
};

export default TooltipWrapper;
