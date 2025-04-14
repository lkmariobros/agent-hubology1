
import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardMetric } from '@/types';
import MetricCard from './MetricCard';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsContainerProps {
  metrics: DashboardMetric[];
  className?: string;
}

const MetricsContainer: React.FC<MetricsContainerProps> = ({ metrics = [], className }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {[1, 2, 3, 4].map((key) => (
          <Skeleton 
            key={key} 
            className="h-[160px] w-full rounded-lg" 
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default MetricsContainer;
