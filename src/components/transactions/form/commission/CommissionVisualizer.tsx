
import React from 'react';
import { CommissionBreakdown } from '@/types/transaction-form';

interface CommissionVisualizerProps {
  commissionBreakdown: CommissionBreakdown;
}

const CommissionVisualizer: React.FC<CommissionVisualizerProps> = ({ commissionBreakdown }) => {
  const { 
    agentCommissionPercentage = 70,
    ourAgencyCommission = 0,
    coAgencyCommission = 0,
    totalCommission
  } = commissionBreakdown;
  
  // Agency percentage is the opposite of agent percentage
  const agencyCommissionPercentage = 100 - agentCommissionPercentage;
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Commission Split Visualization</h3>
      
      <div className="space-y-2">
        <p className="text-sm">Total Commission: {formatCurrency(totalCommission)}</p>
        
        {/* Visualize the split between our agency and co-broker */}
        {coAgencyCommission !== undefined && coAgencyCommission > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Agency Split</p>
            <div className="h-4 w-full flex rounded-sm overflow-hidden">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${(ourAgencyCommission / totalCommission) * 100}%` }}
              ></div>
              <div 
                className="bg-orange-500 h-full" 
                style={{ width: `${(coAgencyCommission / totalCommission) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>Our Agency: {formatCurrency(ourAgencyCommission)}</span>
              <span>Co-Broker: {formatCurrency(coAgencyCommission)}</span>
            </div>
          </div>
        )}
        
        {/* Visualize the split between agent and our agency */}
        <div className="space-y-1 mt-4">
          <p className="text-xs text-muted-foreground">Your Agency Split</p>
          <div className="h-4 w-full flex rounded-sm overflow-hidden">
            <div 
              className="bg-green-500 h-full" 
              style={{ width: `${agentCommissionPercentage}%` }}
            ></div>
            <div 
              className="bg-gray-300 h-full" 
              style={{ width: `${agencyCommissionPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs">
            <span>Agent: {agentCommissionPercentage}%</span>
            <span>Agency: {agencyCommissionPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionVisualizer;
