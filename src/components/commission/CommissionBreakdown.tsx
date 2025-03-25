
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/utils/format';
import { CommissionBreakdownProps } from '@/types';

const CommissionBreakdown = ({
  totalCommission,
  agencyCommission,
  agentCommission,
  personalCommission,
  overrideCommission
}: CommissionBreakdownProps) => {
  // Calculate percentages for visualization
  const agencyPercentage = (agencyCommission / totalCommission) * 100;
  const agentPercentage = (agentCommission / totalCommission) * 100;
  
  // If personal and override commissions are provided, calculate their percentages
  const hasPersonalAndOverride = personalCommission !== undefined && overrideCommission !== undefined;
  const personalPercentage = hasPersonalAndOverride ? (personalCommission / totalCommission) * 100 : 0;
  const overridePercentage = hasPersonalAndOverride ? (overrideCommission / totalCommission) * 100 : 0;

  return (
    <Card className="glass-card">
      <CardHeader className="p-5">
        <CardTitle className="text-lg font-semibold">Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        <div className="flex justify-between items-center">
          <span>Total Commission</span>
          <span className="text-xl font-bold">{formatCurrency(totalCommission)}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Agency Portion</span>
            <div className="flex items-center">
              <span className="font-medium">{formatCurrency(agencyCommission)}</span>
              <span className="text-xs text-muted-foreground ml-2">({agencyPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <Progress value={agencyPercentage} className="h-2 bg-gray-200" />
          
          <div className="flex justify-between items-center text-sm">
            <span>Agent Portion</span>
            <div className="flex items-center">
              <span className="font-medium">{formatCurrency(agentCommission)}</span>
              <span className="text-xs text-muted-foreground ml-2">({agentPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <Progress value={agentPercentage} className="h-2 bg-gray-200" />
        </div>

        {hasPersonalAndOverride && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="text-sm font-medium">Agent Commission Split</div>
            <div className="flex justify-between items-center text-sm">
              <span>Personal Sales</span>
              <div className="flex items-center">
                <span className="font-medium">{formatCurrency(personalCommission)}</span>
                <span className="text-xs text-muted-foreground ml-2">({personalPercentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={personalPercentage} className="h-2 bg-gray-200" />
            
            <div className="flex justify-between items-center text-sm">
              <span>Override Commission</span>
              <div className="flex items-center">
                <span className="font-medium">{formatCurrency(overrideCommission)}</span>
                <span className="text-xs text-muted-foreground ml-2">({overridePercentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={overridePercentage} className="h-2 bg-gray-200" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdown;
