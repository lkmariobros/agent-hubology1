
import React from 'react';
import { DashboardMetric } from '@/types';
import MetricCard from './MetricCard';

interface MetricsContainerProps {
  metrics: DashboardMetric[];
}

const MetricsContainer: React.FC<MetricsContainerProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default MetricsContainer;
