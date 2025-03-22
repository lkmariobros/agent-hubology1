
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { DashboardMetric } from '@/types';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
}

const MetricCard = ({ metric, className }: MetricCardProps) => {
  // Determine text color based on trend
  const getTrendColor = () => {
    if (metric.trend === 'up') return 'text-emerald-400';
    if (metric.trend === 'down') return 'text-red-400';
    return 'text-muted-foreground';
  };
  
  const trendPercentClass = getTrendColor();
  
  return (
    <Card className={cn("border-[rgba(255,255,255,0.06)] bg-[#1a1d25] overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="space-y-1 mb-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {metric.label}
          </p>
        </div>
        
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-foreground">
            {metric.value}
          </h3>
          
          {metric.icon && (
            <div className="rounded-full p-2 bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
              {metric.icon}
            </div>
          )}
        </div>
        
        {metric.change !== undefined && (
          <div className="flex items-center mt-2">
            {metric.trend === 'up' ? (
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-400" />
            ) : metric.trend === 'down' ? (
              <TrendingDown className="mr-1 h-3 w-3 text-red-400" />
            ) : null}
            <span className={`text-xs font-medium ${trendPercentClass}`}>
              {metric.change > 0 ? '+' : ''}
              {metric.change}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
