
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardMetric } from '@/types';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, className }) => {
  // Determine trend indicator and styling
  const showTrendIndicator = metric.change !== undefined && metric.change !== 0;
  const isPositiveTrend = metric.trend === 'up';
  const trendColor = isPositiveTrend ? 'text-emerald-500' : 'text-red-500';
  
  return (
    <Card className={cn(
      "relative border border-[rgba(255,255,255,0.08)] bg-[#1a1d25] shadow-sm overflow-hidden p-6",
      className
    )}>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {metric.label}
        </p>
        
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">{metric.value}</h3>
          <span className="text-muted-foreground/80">
            {metric.icon}
          </span>
        </div>
        
        {showTrendIndicator && (
          <div className={cn("flex items-center text-xs gap-1", trendColor)}>
            {isPositiveTrend ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span className="font-medium">
              {Math.abs(metric.change)}% vs last week
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
