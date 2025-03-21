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
  console.log('CommissionCalculation rendered with formData:', formData);
  console.log('Errors state in CommissionCalculation:', errors);

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

  // Update commission amount in the form data
  useEffect(() => {
    console.log('Updating commission amount to:', commissionBreakdown.totalCommission);
    updateFormData({
      commissionAmount: commissionBreakdown.totalCommission
    });
  }, [commissionBreakdown.totalCommission, updateFormData]);
  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Calculation</h2>
      <p className="text-muted-foreground">
        Set the transaction value and commission rate to calculate the commission breakdown.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 py-0 mx-[8px] my-[6px] px-px">
          <div>
            <Label htmlFor="transactionValue" className="flex items-center gap-1 py-0 my-[8px]">
              <DollarSign className="h-4 w-4" />
              Transaction Value
            </Label>
            <Input id="transactionValue" type="number" value={formData.transactionValue || ''} onChange={handleTransactionValueChange} placeholder="Enter transaction value" className={errors.transactionValue ? 'border-destructive' : ''} />
            {errors.transactionValue && <p className="text-sm text-destructive mt-1">{errors.transactionValue}</p>}
          </div>
          
          <div>
            <Label htmlFor="commissionRate" className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Commission Rate (%)
            </Label>
            <Tabs defaultValue={formData.commissionRate ? formData.commissionRate.toString() : "2"} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 w-full py-0 my-[9px]">
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
          
          <div>
            
            <div className="flex items-center space-x-2">
              
              
            </div>
            
          </div>
          
          {formData.coBroking?.enabled && <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Co-Broking Split</h3>
              <p className="text-xs text-muted-foreground mb-2">
                This property is co-brokered. The commission will be split between agencies before internal splits are calculated.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Our Agency: {agencySplitPercentage}%</span>
                <span className="text-sm">Co-Broker: {coAgencySplitPercentage}%</span>
              </div>
            </div>}
          
          <div className="bg-muted/50 p-4 rounded-md">
            <h3 className="text-sm font-semibold flex items-center gap-1 mb-2">
              <Award className="h-4 w-4" />
              {agentTier.name} Commission Split
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              Your current commission split rate is {agentPortionPercentage}/{agencyPortionPercentage} based on your tier.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">You: {agentPortionPercentage}%</span>
              <span className="text-sm">Agency: {agencyPortionPercentage}%</span>
            </div>
          </div>
        </div>
        
        <Card className="h-full bg-muted/40">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5" />
              Commission Breakdown
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Total Transaction Value:</span>
                <span className="font-medium">{formatCurrency(commissionBreakdown.transactionValue)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Commission Rate:</span>
                <span className="font-medium">{commissionBreakdown.commissionRate}%</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Total Commission:</span>
                <span className="font-medium">{formatCurrency(commissionBreakdown.totalCommission)}</span>
              </div>
              
              {formData.coBroking?.enabled && <div className="pt-2 space-y-3 border-b pb-4">
                  <h4 className="font-medium">Inter-Agency Split</h4>
                  
                  <div className="flex justify-between items-center pl-4">
                    <span className="text-muted-foreground">Our Agency Portion ({agencySplitPercentage}%):</span>
                    <span className="font-medium">{formatCurrency(commissionBreakdown.ourAgencyCommission || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pl-4">
                    <span className="text-muted-foreground">Co-Agency Portion ({coAgencySplitPercentage}%):</span>
                    <span className="font-medium">{formatCurrency(commissionBreakdown.coAgencyCommission || 0)}</span>
                  </div>
                </div>}
              
              <div className="pt-2 space-y-3">
                <h4 className="font-medium flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {agentTier.name} Tier Internal Split
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
            
            {/* Visual representation of the split */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Your Commission Split</h4>
              <div className="h-4 w-full flex rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{
                width: `${agentPortionPercentage}%`
              }} title={`Your Share: ${agentPortionPercentage}%`}></div>
                <div className="bg-primary h-full" style={{
                width: `${agencyPortionPercentage}%`
              }} title={`Agency: ${agencyPortionPercentage}%`}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>Your Share ({agentPortionPercentage}%)</span>
                <span>Agency ({agencyPortionPercentage}%)</span>
              </div>
              
              {formData.coBroking?.enabled && <>
                  <h4 className="text-sm font-medium mb-2 mt-4">Inter-Agency Split</h4>
                  <div className="h-4 w-full flex rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{
                  width: `${agencySplitPercentage}%`
                }} title={`Our Agency: ${agencySplitPercentage}%`}></div>
                    <div className="bg-orange-500 h-full" style={{
                  width: `${coAgencySplitPercentage}%`
                }} title={`Co-Broker: ${coAgencySplitPercentage}%`}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>Our Agency ({agencySplitPercentage}%)</span>
                    <span>Co-Broker ({coAgencySplitPercentage}%)</span>
                  </div>
                </>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default CommissionCalculation;