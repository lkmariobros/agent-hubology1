
import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardMetric } from '@/types';
import MetricCard from './MetricCard';

interface MetricsContainerProps {
  metrics: DashboardMetric[];
  className?: string;
}

const MetricsContainer: React.FC<MetricsContainerProps> = ({ metrics, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default MetricsContainer;
