
import React, { useEffect, useState } from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { getDefaultCommissionRate } from '@/context/TransactionForm/initialState';
import { Calculator, Percent, DollarSign, Building, User, Users, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentRank } from '@/types/transaction-form';
import AgentTierInfo from './commission/AgentTierInfo';
import CommissionBreakdownCard from './commission/CommissionBreakdownCard';

// Agent tier definitions - Would be fetched from API in production
const AGENT_TIERS = [{
  id: 1,
  name: 'Advisor',
  rank: 'Advisor' as AgentRank,
  agentPercentage: 70
}, {
  id: 2,
  name: 'Sales Leader',
  rank: 'Sales Leader' as AgentRank,
  agentPercentage: 80
}, {
  id: 3,
  name: 'Team Leader',
  rank: 'Team Leader' as AgentRank,
  agentPercentage: 83
}, {
  id: 4,
  name: 'Group Leader',
  rank: 'Group Leader' as AgentRank,
  agentPercentage: 85
}, {
  id: 5,
  name: 'Supreme Leader',
  rank: 'Supreme Leader' as AgentRank,
  agentPercentage: 85
}];

// Mock function to get current agent's tier - would be replaced with actual API call
const getCurrentAgentTier = () => {
  // In production, this would fetch the current user's tier from an API
  return AGENT_TIERS[2]; // Default to Team Leader tier for demonstration
};

const CommissionCalculation: React.FC = () => {
  const {
    state,
    updateFormData,
    calculateCommission
  } = useTransactionForm();
  const {
    formData,
    errors
  } = state;
  const [agentTier, setAgentTier] = useState(getCurrentAgentTier());
  const [isRental, setIsRental] = useState(formData.transactionType === 'Rent');
  const [ownerCommissionAmount, setOwnerCommissionAmount] = useState<number>(
    // Initialize with transaction value if it's a rental (1 month rent)
    isRental && formData.transactionValue ? formData.transactionValue : 0
  );
  
  console.log('CommissionCalculation rendered with formData:', formData);
  console.log('Errors state in CommissionCalculation:', errors);

  // Check if the transaction is a rental and update state
  useEffect(() => {
    setIsRental(formData.transactionType === 'Rent');
  }, [formData.transactionType]);

  // Initialize agent tier in form data if not set
  useEffect(() => {
    if (!formData.agentTier) {
      // Set the agent tier from the current user's profile
      updateFormData({
        agentTier: agentTier.rank
      });
    }
  }, [formData.agentTier, agentTier.rank, updateFormData]);

  // Get the tier-based agent percentage (how much of agency's portion goes to agent)
  const agentPortionPercentage = agentTier.agentPercentage;
  const agencyPortionPercentage = 100 - agentPortionPercentage;

  // Calculate agency split for co-broking (default to 50%)
  const agencySplitPercentage = formData.coBroking?.enabled ? formData.coBroking?.commissionSplit || 50 : 100;
  const coAgencySplitPercentage = formData.coBroking?.enabled ? 100 - agencySplitPercentage : 0;

  // Calculate the commissions based on the business rules
  const commissionBreakdown = calculateCommission();

  // Update default commission rate when transaction type changes
  useEffect(() => {
    console.log('Commission rate effect triggered with rate:', formData.commissionRate);
    if (formData.commissionRate === 0) {
      const defaultRate = getDefaultCommissionRate(formData.transactionType);
      console.log('Setting default commission rate to:', defaultRate);
      updateFormData({
        commissionRate: defaultRate
      });
    }
  }, [formData.transactionType, formData.commissionRate, updateFormData]);

  // Handler for transaction value changes
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    console.log('Transaction value changed to:', value);
    updateFormData({
      transactionValue: value
    });
    
    // For rental transactions, default the owner commission to the monthly rent value
    if (isRental) {
      setOwnerCommissionAmount(value);
      updateFormData({
        commissionAmount: value // Set default commission to one month's rent
      });
    }
  };

  // Handler for owner commission amount changes (for rentals)
  const handleOwnerCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setOwnerCommissionAmount(amount);
    
    // Update the commission amount in the form data directly
    updateFormData({
      commissionAmount: amount
    });
  };

  // Handler for commission rate changes
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    console.log('Commission rate changed to:', rate);
    updateFormData({
      commissionRate: rate
    });
  };

  // Handle tab selection for predefined commission rates
  const handleTabChange = (value: string) => {
    console.log('Commission rate tab changed to:', value);
    if (value !== 'Custom') {
      updateFormData({
        commissionRate: parseFloat(value)
      });
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Update commission amount in the form data for non-rental transactions
  useEffect(() => {
    if (!isRental) {
      console.log('Updating commission amount to:', commissionBreakdown.totalCommission);
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
          <div>
            <Label htmlFor="transactionValue" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {isRental ? "Monthly Rental Value" : "Transaction Value"}
            </Label>
            <Input 
              id="transactionValue" 
              type="number" 
              value={formData.transactionValue || ''} 
              onChange={handleTransactionValueChange} 
              placeholder={isRental ? "Enter monthly rental value" : "Enter transaction value"} 
              className={errors.transactionValue ? 'border-destructive' : ''} 
            />
            {errors.transactionValue && <p className="text-sm text-destructive mt-1">{errors.transactionValue}</p>}
          </div>
          
          {isRental ? (
            <div>
              <Label htmlFor="ownerCommission" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Owner Commission Amount
              </Label>
              <Input 
                id="ownerCommission" 
                type="number" 
                value={ownerCommissionAmount || ''} 
                onChange={handleOwnerCommissionChange} 
                placeholder="Enter owner commission amount" 
                className={errors.commissionAmount ? 'border-destructive' : ''} 
              />
              {errors.commissionAmount && <p className="text-sm text-destructive mt-1">{errors.commissionAmount}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                The amount of commission provided by the property owner (typically one month's rent).
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="commissionRate" className="flex items-center gap-1">
                <Percent className="h-4 w-4" />
                Commission Rate (%)
              </Label>
              <Tabs defaultValue={formData.commissionRate ? formData.commissionRate.toString() : "2"} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="1">1%</TabsTrigger>
                  <TabsTrigger value="2">2%</TabsTrigger>
                  <TabsTrigger value="3">3%</TabsTrigger>
                  <TabsTrigger value="Custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="Custom" className="mt-2">
                  <Input id="commissionRate" type="number" min="0.1" max="10" step="0.1" value={formData.commissionRate || 0} onChange={handleCommissionRateChange} className={errors.commissionRate ? 'border-destructive' : ''} />
                </TabsContent>
              </Tabs>
              {errors.commissionRate && <p className="text-sm text-destructive mt-1">{errors.commissionRate}</p>}
            </div>
          )}
          
          {formData.coBroking?.enabled && (
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Co-Broking Split</h3>
              <p className="text-xs text-muted-foreground mb-2">
                This property is co-brokered. The commission will be split between agencies before internal splits are calculated.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Our Agency: {agencySplitPercentage}%</span>
                <span className="text-sm">Co-Broker: {coAgencySplitPercentage}%</span>
              </div>
            </div>
          )}
          
          <AgentTierInfo agentTier={agentTier} />
        </div>
        
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
