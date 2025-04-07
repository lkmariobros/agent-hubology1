
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommissionBreakdown } from '@/types/transaction-form';

interface CommissionBreakdownCardProps {
  breakdown: CommissionBreakdown;
}

const CommissionBreakdownCard: React.FC<CommissionBreakdownCardProps> = ({ breakdown }) => {
  const {
    totalCommission,
    agencyShare,
    agentShare,
    agentCommissionPercentage = 70,
    transactionValue = 0,
    commissionRate = 0
  } = breakdown;
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Transaction Value:</span>
            <span className="font-medium">{formatCurrency(transactionValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Commission Rate:</span>
            <span className="font-medium">{commissionRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Commission:</span>
            <span className="font-medium">{formatCurrency(totalCommission)}</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-border my-2" />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Agent Share ({agentCommissionPercentage}%):</span>
            <span className="font-medium">{formatCurrency(agentShare)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Agency Share ({100 - agentCommissionPercentage}%):</span>
            <span className="font-medium">{formatCurrency(agencyShare)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdownCard;
