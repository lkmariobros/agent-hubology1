
import React, { useState, useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import AgentTierSelector from './commission/AgentTierSelector';
import CommissionInputs from './commission/CommissionInputs';
import AgentTierInfo from './commission/AgentTierInfo';
import CommissionBreakdownCard from './commission/CommissionBreakdownCard';
import CoBrokingInfoCard from './commission/CoBrokingInfoCard';
import CommissionVisualizer from './commission/CommissionVisualizer';
import CommissionNotifications from './commission/CommissionNotifications';
import ApprovalInfo from './commission/ApprovalInfo';
import { useAgentProfile } from '@/hooks/useAgentProfile';

const CommissionCalculation: React.FC = () => {
  const { state, updateFormData, calculateCommission } = useTransactionForm();
  const { formData, errors } = state;
  const [ownerCommissionAmount, setOwnerCommissionAmount] = useState(formData.commissionAmount || 0);
  const { data: agentProfile } = useAgentProfile();
  
  const {
    transactionValue = 0,
    commissionRate = 0,
    agentTier = 'Advisor',
    transactionType
  } = formData;
  
  // Sync agent tier with profile when it loads
  useEffect(() => {
    if (agentProfile && agentProfile.tier_name && agentTier !== agentProfile.tier_name) {
      updateFormData({ agentTier: agentProfile.tier_name });
    }
  }, [agentProfile, agentTier, updateFormData]);
  
  const handleAgentTierChange = (tier: string) => {
    updateFormData({ agentTier: tier as any });
  };
  
  // Calculate commission
  const commissionBreakdown = calculateCommission();
  const totalCommission = commissionBreakdown.totalCommission || 0;
  
  // Determine if it's a rental transaction
  const isRental = transactionType === 'Rent';
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  // Calculate agent and agency percentages
  const agentPortionPercentage = commissionBreakdown.agentCommissionPercentage || 70;
  const agencyPortionPercentage = 100 - agentPortionPercentage;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CommissionInputs 
                isRental={isRental}
                ownerCommissionAmount={ownerCommissionAmount}
                setOwnerCommissionAmount={setOwnerCommissionAmount}
              />
              
              {errors.transactionValue && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.transactionValue}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="pt-4 border-t">
                <AgentTierSelector 
                  value={agentTier} 
                  onChange={handleAgentTierChange} 
                />
              </div>
            </CardContent>
          </Card>
          
          <ApprovalInfo commissionAmount={totalCommission} />
          
          <CommissionNotifications 
            commissionAmount={totalCommission}
            isSubmitting={state.isSubmitting}
          />
          
          {formData.coBroking?.enabled && (
            <CoBrokingInfoCard
              enabled={formData.coBroking.enabled}
              agencySplitPercentage={formData.coBroking.commissionSplit}
              coAgencySplitPercentage={100 - formData.coBroking.commissionSplit}
            />
          )}
        </div>
        
        <div className="space-y-6">
          <CommissionBreakdownCard 
            commissionBreakdown={commissionBreakdown}
            agentTier={agentTier}
            agentPortionPercentage={agentPortionPercentage}
            agencyPortionPercentage={agencyPortionPercentage}
            coBroking={{
              enabled: formData.coBroking?.enabled || false,
              commissionSplit: formData.coBroking?.commissionSplit || 50
            }}
            formatCurrency={formatCurrency}
            isRental={isRental}
          />
          
          <Card className="bg-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Commission Split Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <CommissionVisualizer 
                agentPercentage={agentPortionPercentage}
                agencyPercentage={agencyPortionPercentage}
                coBrokingEnabled={formData.coBroking?.enabled || false}
                agencySplitPercentage={formData.coBroking?.commissionSplit || 50}
                coAgencySplitPercentage={formData.coBroking?.enabled ? 100 - (formData.coBroking?.commissionSplit || 50) : 50}
              />
            </CardContent>
          </Card>
          
          <AgentTierInfo 
            agentTier={{
              name: agentTier,
              rank: agentTier,
              agentPercentage: agentPortionPercentage
            }}
          />
        </div>
      </div>
      
      {/* Remove duplicate commission visualizer that was causing layout issues */}
    </div>
  );
};

export default CommissionCalculation;
