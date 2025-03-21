
import React, { useState, useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { Calculator } from 'lucide-react';
import { getCurrentAgentTier, AGENT_TIERS } from './commission/AgentTierSelector';
import { isRentalTransaction, formatCurrency } from './commission/utils';
import AgentTierSelector from './commission/AgentTierSelector';
import CommissionInputs from './commission/CommissionInputs';
import CommissionBreakdownCard from './commission/CommissionBreakdownCard';
import ApprovalInfo from './commission/ApprovalInfo';
import CoBrokingInfoCard from './commission/CoBrokingInfoCard';
import AgentTierInfo from './commission/AgentTierInfo';
import { AgentRank } from '@/types/transaction-form';

const CommissionCalculation: React.FC = () => {
  const {
    state,
    updateFormData,
    calculateCommission
  } = useTransactionForm();
  
  const { formData, errors } = state;
  const [agentTier, setAgentTier] = useState(getCurrentAgentTier());
  const [isRental, setIsRental] = useState(formData.transactionType === 'Rent');
  const [ownerCommissionAmount, setOwnerCommissionAmount] = useState<number>(
    // Initialize with transaction value if it's a rental (1 month rent)
    isRental && formData.transactionValue ? formData.transactionValue : 0
  );
  
  // Check if the transaction is a rental and update state
  useEffect(() => {
    setIsRental(formData.transactionType === 'Rent');
  }, [formData.transactionType]);

  // Get the tier-based agent percentage (how much of agency's portion goes to agent)
  const agentPortionPercentage = agentTier.agentPercentage;
  const agencyPortionPercentage = 100 - agentPortionPercentage;

  // Calculate agency split for co-broking (default to 50%)
  const agencySplitPercentage = formData.coBroking?.enabled ? formData.coBroking?.commissionSplit || 50 : 100;
  const coAgencySplitPercentage = formData.coBroking?.enabled ? 100 - agencySplitPercentage : 0;

  // Calculate the commissions based on the business rules
  const commissionBreakdown = calculateCommission();

  // Update agent tier when form data changes
  useEffect(() => {
    if (formData.agentTier) {
      const tier = AGENT_TIERS.find(t => t.rank === formData.agentTier);
      if (tier) {
        setAgentTier(tier);
      }
    }
  }, [formData.agentTier]);
  
  // Handle agent tier change
  const handleAgentTierChange = (tier: AgentRank) => {
    updateFormData({ agentTier: tier });
  };

  // Update commission amount in the form data for non-rental transactions
  useEffect(() => {
    if (!isRental) {
      updateFormData({
        commissionAmount: commissionBreakdown.totalCommission
      });
    }
  }, [commissionBreakdown.totalCommission, updateFormData, isRental]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Calculation</h2>
      <p className="text-muted-foreground">
        {isRental 
          ? "Set the monthly rental value and owner commission amount for this rental transaction."
          : "Set the transaction value and commission rate to calculate the commission breakdown."
        }
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Commission Inputs Component */}
          <CommissionInputs 
            isRental={isRental}
            ownerCommissionAmount={ownerCommissionAmount}
            setOwnerCommissionAmount={setOwnerCommissionAmount}
          />
          
          {/* Co-Broking Information */}
          <CoBrokingInfoCard 
            enabled={!!formData.coBroking?.enabled}
            agencySplitPercentage={agencySplitPercentage}
            coAgencySplitPercentage={coAgencySplitPercentage}
          />
          
          {/* Agent Tier Selection */}
          <AgentTierSelector
            value={formData.agentTier}
            onChange={handleAgentTierChange}
          />
          
          {/* Agent Tier Info Card */}
          <AgentTierInfo agentTier={agentTier} />
          
          {/* Approval Info Component */}
          <ApprovalInfo commissionAmount={commissionBreakdown.totalCommission} />
        </div>
        
        {/* Commission Breakdown Card */}
        <CommissionBreakdownCard 
          commissionBreakdown={commissionBreakdown}
          agentTier={agentTier.name}
          agentPortionPercentage={agentPortionPercentage}
          agencyPortionPercentage={agencyPortionPercentage}
          coBroking={{
            enabled: !!formData.coBroking?.enabled,
            commissionSplit: formData.coBroking?.commissionSplit || 50
          }}
          formatCurrency={formatCurrency}
          isRental={isRental}
        />
      </div>
    </div>
  );
};

export default CommissionCalculation;
