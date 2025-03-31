
import React from 'react';
import LoadingIndicator from './loading-indicator';

export const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingIndicator size="lg" text="Loading content..." />
    </div>
  );
};

export default LoadingPage;
