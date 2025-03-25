
import React from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const CommissionCalculation: React.FC = () => {
  const { state, updateFormData, calculateCommission } = useTransactionForm();
  const { formData, errors } = state;
  
  const {
    transactionValue = 0,
    commissionRate = 0,
    agentTier
  } = formData;
  
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({ transactionValue: value });
  };
  
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({ commissionRate: value });
  };
  
  const handleAgentTierChange = (tier: string) => {
    updateFormData({ agentTier: tier as any });
  };
  
  // Calculate commission
  const commissionBreakdown = calculateCommission();
  const totalCommission = commissionBreakdown.totalCommission || 0;
  
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
                transactionValue={transactionValue}
                commissionRate={commissionRate}
                onTransactionValueChange={handleTransactionValueChange}
                onCommissionRateChange={handleCommissionRateChange}
                transactionType={formData.transactionType}
                errors={errors}
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
                  value={agentTier || 'Advisor'} 
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
              coBroking={formData.coBroking}
              commissionSplit={formData.coBroking.commissionSplit}
            />
          )}
        </div>
        
        <div className="space-y-6">
          <CommissionBreakdownCard breakdown={commissionBreakdown} />
          <CommissionVisualizer breakdown={commissionBreakdown} />
          <AgentTierInfo currentTier={agentTier || 'Advisor'} />
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculation;
