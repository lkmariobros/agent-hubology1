
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { DashboardMetric } from '@/types';

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
}

const MetricCard = ({ metric, className = '' }: MetricCardProps) => {
  const getTrendIcon = () => {
    if (metric.trend === 'up' || (metric.percentChange && metric.percentChange > 0)) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    }
    if (metric.trend === 'down' || (metric.percentChange && metric.percentChange < 0)) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return <ArrowRightIcon className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (metric.trend === 'up' || (metric.percentChange && metric.percentChange > 0)) {
      return 'text-green-500';
    }
    if (metric.trend === 'down' || (metric.percentChange && metric.percentChange < 0)) {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };

  return (
    <Card className={`shadow-sm overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
            {(metric.percentChange !== undefined || metric.change !== undefined) && (
              <div className="flex items-center mt-1">
                {getTrendIcon()}
                <span className={`text-xs font-medium ml-1 ${getTrendColor()}`}>
                  {metric.percentChange !== undefined
                    ? `${Math.abs(metric.percentChange)}%`
                    : metric.change !== undefined
                    ? `${metric.change > 0 ? '+' : ''}${metric.change}`
                    : '0%'}
                </span>
                {metric.timeframe && (
                  <span className="text-xs text-muted-foreground ml-1">
                    vs {metric.timeframe}
                  </span>
                )}
              </div>
            )}
          </div>
          {metric.icon && (
            <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
              {metric.icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
