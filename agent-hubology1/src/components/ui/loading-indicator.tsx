
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'inline' | 'overlay';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  className,
  text = 'Loading...',
  fullScreen = false,
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const Container = ({ children }: { children: React.ReactNode }) => {
    if (fullScreen) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          {children}
        </div>
      );
    }
    
    if (variant === 'overlay') {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-md z-10">
          {children}
        </div>
      );
    }
    
    if (variant === 'inline') {
      return (
        <span className="inline-flex items-center">
          {children}
        </span>
      );
    }
    
    return <>{children}</>;
  };

  return (
    <Container>
      <div className={cn(
        "flex items-center justify-center space-y-0",
        variant === 'inline' ? "flex-row space-x-2" : "flex-col space-y-2",
        className
      )}>
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && <p className={cn(
          "text-muted-foreground",
          size === 'sm' ? "text-xs" : "text-sm"
        )}>{text}</p>}
      </div>
    </Container>
  );
};

export default LoadingIndicator;
