
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { DashboardMetric } from '@/types';

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
}

const MetricCard = ({ metric, className }: MetricCardProps) => {
  const { label, value, change, trend, icon } = metric;
  
  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-gradient mb-1">{value}</h3>
            {change !== undefined && trend && (
              <div className="flex items-center">
                <span 
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                  )}
                >
                  {trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : trend === 'down' ? (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  ) : null}
                  {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                  {Math.abs(change)}%
                </span>
                <span className="text-xs ml-1 text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
