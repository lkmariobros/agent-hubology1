
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Simplified interface to avoid potential type issues
interface CommissionBreakdownProps {
  breakdown: any; // Using any to avoid potential type issues
}

// Simplified component for debugging
const CommissionBreakdownCard: React.FC<CommissionBreakdownProps> = ({ breakdown }) => {
  console.log('DEBUG - Rendering CommissionBreakdownCard with:', breakdown);

  // Use default values to prevent errors
  const totalCommission = breakdown?.totalCommission || 5000;
  const agencyShare = breakdown?.agencyShare || 1500;
  const agentShare = breakdown?.agentShare || 3500;
  const agentCommissionPercentage = breakdown?.agentCommissionPercentage || 70;
  const transactionValue = breakdown?.transactionValue || 100000;
  const commissionRate = breakdown?.commissionRate || 5;

  // Format currency
  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('DEBUG - Error formatting currency:', error);
      return '$0.00';
    }
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
