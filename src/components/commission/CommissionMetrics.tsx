
import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import CommissionMetricsCard from './CommissionMetricsCard';

interface MetricsData {
  currentMonth: {
    earned: number;
    target: number;
    progress: number;
  };
  previousMonth: {
    earned: number;
    target: number;
    progress: number;
  };
  yearToDate: {
    earned: number;
    target: number;
    progress: number;
  };
}

interface CommissionMetricsProps {
  metrics: MetricsData;
}

const CommissionMetrics: React.FC<CommissionMetricsProps> = ({ metrics }) => {
  const { currentMonth, previousMonth, yearToDate } = metrics;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card rounded-lg border shadow">
        <div className="p-5">
          <h3 className="text-sm font-medium text-muted-foreground">Current Month</h3>
          <div className="mt-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">{formatCurrency(currentMonth.earned)}</span>
            <span className="text-muted-foreground">/ {formatCurrency(currentMonth.target)}</span>
          </div>
          <div className="mt-4 space-y-2">
            <Progress 
              value={currentMonth.progress} 
              className="h-2 bg-blue-100" 
              indicatorClassName="bg-blue-500"
            />
            <p className="text-xs text-muted-foreground">
              {currentMonth.progress.toFixed(2)}% of monthly target
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow">
        <div className="p-5">
          <h3 className="text-sm font-medium text-muted-foreground">Previous Month</h3>
          <div className="mt-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold">{formatCurrency(previousMonth.earned)}</span>
            <span className="text-muted-foreground">/ {formatCurrency(previousMonth.target)}</span>
          </div>
          <div className="mt-4 space-y-2">
            <Progress 
              value={previousMonth.progress} 
              className="h-2 bg-purple-100" 
              indicatorClassName="bg-purple-500"
            />
            <p className="text-xs text-muted-foreground">
              {previousMonth.progress.toFixed(2)}% of monthly target
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow">
        <div className="p-5">
          <h3 className="text-sm font-medium text-muted-foreground">Year to Date</h3>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            <span className="text-2xl font-bold">{formatCurrency(yearToDate.earned)}</span>
            <span className="text-muted-foreground">/ {formatCurrency(yearToDate.target)}</span>
          </div>
          <div className="mt-4 space-y-2">
            <Progress 
              value={yearToDate.progress} 
              className="h-2 bg-pink-100" 
              indicatorClassName="bg-pink-500"
            />
            <p className="text-xs text-muted-foreground">
              {yearToDate.progress.toFixed(2)}% of yearly target
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionMetrics;
