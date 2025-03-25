
import React from 'react';
import { Calculator, Building, User, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CommissionBreakdown } from '@/types/transaction-form';
import CommissionVisualizer from './CommissionVisualizer';

interface CommissionBreakdownCardProps {
  commissionBreakdown: CommissionBreakdown;
  agentTier: string;
  agentPortionPercentage: number;
  agencyPortionPercentage: number;
  coBroking: {
    enabled: boolean;
    commissionSplit: number;
  };
  formatCurrency: (amount: number) => string;
  isRental?: boolean;
}

const CommissionBreakdownCard: React.FC<CommissionBreakdownCardProps> = ({
  commissionBreakdown,
  agentTier,
  agentPortionPercentage,
  agencyPortionPercentage,
  coBroking,
  formatCurrency,
  isRental = false
}) => {
  return (
    <Card className="h-full bg-muted/40">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5" />
          Commission Breakdown
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-muted-foreground">
              {isRental ? 'Monthly Rental Value:' : 'Total Transaction Value:'}
            </span>
            <span className="font-medium">{formatCurrency(commissionBreakdown.transactionValue || 0)}</span>
          </div>
          
          {isRental && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Owner Commission Amount:</span>
              <span className="font-medium">{formatCurrency(commissionBreakdown.totalCommission)}</span>
            </div>
          )}
          
          {!isRental && (
            <>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Commission Rate:</span>
                <span className="font-medium">{commissionBreakdown.commissionRate || 0}%</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Total Commission:</span>
                <span className="font-medium">{formatCurrency(commissionBreakdown.totalCommission)}</span>
              </div>
            </>
          )}
          
          {coBroking.enabled && (
            <div className="pt-2 space-y-3 border-b pb-4">
              <h4 className="font-medium">Inter-Agency Split</h4>
              
              <div className="flex justify-between items-center pl-4">
                <span className="text-muted-foreground">Our Agency Portion ({coBroking.commissionSplit}%):</span>
                <span className="font-medium">{formatCurrency(commissionBreakdown.ourAgencyCommission || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center pl-4">
                <span className="text-muted-foreground">Co-Agency Portion ({100 - coBroking.commissionSplit}%):</span>
                <span className="font-medium">{formatCurrency(commissionBreakdown.coAgencyCommission || 0)}</span>
              </div>
            </div>
          )}
          
          <div className="pt-2 space-y-3">
            <h4 className="font-medium flex items-center gap-1">
              <Award className="h-4 w-4" />
              {agentTier} Tier Internal Split
            </h4>
            
            <div className="flex justify-between items-center pl-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Building className="h-4 w-4" />
                Agency Share ({agencyPortionPercentage}%):
              </span>
              <span className="font-medium">{formatCurrency(commissionBreakdown.agencyShare)}</span>
            </div>
            
            <div className="flex justify-between items-center pl-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                Your Share ({agentPortionPercentage}%):
              </span>
              <span className="font-medium">{formatCurrency(commissionBreakdown.agentShare)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdownCard;
