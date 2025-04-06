
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface CommissionMetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const CommissionMetricsCard: React.FC<CommissionMetricsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        
        {description && (
          <CardDescription className="text-xs mt-1">{description}</CardDescription>
        )}
        
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionMetricsCard;
