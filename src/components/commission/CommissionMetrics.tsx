
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">${currentMonth.earned.toLocaleString()}</span>
            <span className="text-muted-foreground ml-2">/ ${currentMonth.target.toLocaleString()}</span>
          </div>
          <Progress 
            value={currentMonth.progress} 
            className="h-2 mt-4" 
            indicatorClassName="bg-property-blue"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {currentMonth.progress}% of monthly target
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Previous Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">${previousMonth.earned.toLocaleString()}</span>
            <span className="text-muted-foreground ml-2">/ ${previousMonth.target.toLocaleString()}</span>
          </div>
          <Progress 
            value={previousMonth.progress} 
            className="h-2 mt-4" 
            indicatorClassName="bg-property-purple"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {previousMonth.progress}% of monthly target
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">${yearToDate.earned.toLocaleString()}</span>
            <span className="text-muted-foreground ml-2">/ ${yearToDate.target.toLocaleString()}</span>
          </div>
          <Progress 
            value={yearToDate.progress} 
            className="h-2 mt-4" 
            indicatorClassName="bg-property-pink"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {yearToDate.progress}% of yearly target
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionMetrics;
