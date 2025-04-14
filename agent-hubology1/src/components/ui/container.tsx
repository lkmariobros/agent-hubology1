
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'full';
  withHeader?: boolean;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  withHeader = false,
  ...props 
}) => {
  const variantClasses = {
    default: "container mx-auto px-4 sm:px-6 lg:px-8",
    narrow: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl",
    full: "w-full px-4 sm:px-6 lg:px-8",
  };
  
  const heightClass = withHeader 
    ? "min-h-[calc(100vh-64px)]" // Adjust based on your header height
    : "min-h-screen";
  
  return (
    <div 
      className={cn(
        variantClasses[variant],
        heightClass,
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export { Container };
export default Container;
