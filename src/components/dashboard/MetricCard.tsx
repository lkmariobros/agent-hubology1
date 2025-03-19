
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
  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <h3 className="text-xl md:text-2xl font-bold mt-1 text-gradient">
              {metric.value}
            </h3>
          </div>
          {metric.icon && (
            <div className="rounded-full p-2 bg-white/5">
              {metric.icon}
            </div>
          )}
        </div>
        
        {metric.change !== undefined && (
          <div className="flex items-center mt-3 md:mt-4">
            {metric.trend === 'up' ? (
              <TrendingUp className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 text-green-400" />
            ) : metric.trend === 'down' ? (
              <TrendingDown className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 text-red-400" />
            ) : null}
            <span
              className={
                metric.trend === 'up'
                  ? 'text-green-400 text-xs md:text-sm'
                  : metric.trend === 'down'
                  ? 'text-red-400 text-xs md:text-sm'
                  : 'text-muted-foreground text-xs md:text-sm'
              }
            >
              {metric.change > 0 ? '+' : ''}
              {metric.change}%
            </span>
            <span className="text-muted-foreground text-xs md:text-sm ml-1">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
