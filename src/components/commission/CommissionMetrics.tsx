
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-[rgba(255,255,255,0.08)] bg-[#1a1d25] shadow-sm">
        <CardHeader className="p-5">
          <CardTitle className="text-sm font-medium">Current Month</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">${currentMonth.earned.toLocaleString()}</span>
            <span className="text-muted-foreground">/ ${currentMonth.target.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Progress 
              value={currentMonth.progress} 
              className="h-2" 
              indicatorClassName="bg-property-blue"
            />
            <p className="text-xs text-muted-foreground">
              {currentMonth.progress}% of monthly target
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-[rgba(255,255,255,0.08)] bg-[#1a1d25] shadow-sm">
        <CardHeader className="p-5">
          <CardTitle className="text-sm font-medium">Previous Month</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">${previousMonth.earned.toLocaleString()}</span>
            <span className="text-muted-foreground">/ ${previousMonth.target.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Progress 
              value={previousMonth.progress} 
              className="h-2" 
              indicatorClassName="bg-property-purple"
            />
            <p className="text-xs text-muted-foreground">
              {previousMonth.progress}% of monthly target
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-[rgba(255,255,255,0.08)] bg-[#1a1d25] shadow-sm">
        <CardHeader className="p-5">
          <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">${yearToDate.earned.toLocaleString()}</span>
            <span className="text-muted-foreground">/ ${yearToDate.target.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Progress 
              value={yearToDate.progress} 
              className="h-2" 
              indicatorClassName="bg-property-pink"
            />
            <p className="text-xs text-muted-foreground">
              {yearToDate.progress}% of yearly target
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionMetrics;
