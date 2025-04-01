
import React, { useState, useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Award } from 'lucide-react';
import CommissionInputs from './commission/CommissionInputs';
import CommissionBreakdownCard from './commission/CommissionBreakdownCard';
import CoBrokingInfoCard from './commission/CoBrokingInfoCard';
import CommissionVisualizer from './commission/CommissionVisualizer';
import PaymentScheduleSelector from './commission/PaymentScheduleSelector';
import { useAgentProfile } from '@/hooks/useAgentProfile';
import { AgentRank } from '@/types';
import { stringToAgentRank } from '@/utils/typeConversions';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';

const CommissionCalculation: React.FC = () => {
  const {
    state,
    updateFormData,
    calculateCommission,
    selectPaymentSchedule
  } = useTransactionForm();
  
  const {
    formData,
    errors
  } = state;
  
  const [ownerCommissionAmount, setOwnerCommissionAmount] = useState(formData.commissionAmount || 0);
  
  const { data: agentProfile } = useAgentProfile();
  const { defaultPaymentSchedule } = usePaymentSchedules();
  
  const {
    transactionValue = 0,
    commissionRate = 0,
    agentTier = 'Advisor',
    transactionType,
    paymentScheduleId = defaultPaymentSchedule?.id || '',
  } = formData;

  // Sync agent tier with profile when it loads - this is now the ONLY way to set the tier
  useEffect(() => {
    if (agentProfile && agentProfile.tier_name) {
      updateFormData({
        agentTier: stringToAgentRank(agentProfile.tier_name)
      });
    }
  }, [agentProfile, updateFormData]);
  
  // Set default payment schedule when available
  useEffect(() => {
    if (defaultPaymentSchedule?.id && !paymentScheduleId) {
      updateFormData({
        paymentScheduleId: defaultPaymentSchedule.id
      });
    }
  }, [defaultPaymentSchedule, paymentScheduleId, updateFormData]);

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
  
  const handlePaymentScheduleChange = (scheduleId: string) => {
    selectPaymentSchedule(scheduleId);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Commission Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CommissionInputs isRental={isRental} ownerCommissionAmount={ownerCommissionAmount} setOwnerCommissionAmount={setOwnerCommissionAmount} />
              
              {errors.transactionValue && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.transactionValue}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {formData.coBroking?.enabled && (
            <div className="mt-6">
              <CoBrokingInfoCard 
                enabled={formData.coBroking.enabled} 
                agencySplitPercentage={formData.coBroking.commissionSplit} 
                coAgencySplitPercentage={100 - formData.coBroking.commissionSplit} 
              />
            </div>
          )}
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentScheduleSelector 
                  value={paymentScheduleId}
                  onChange={handlePaymentScheduleChange}
                  commissionAmount={totalCommission}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="bg-[#111827] text-white">
            <CardHeader className="pb-2">
              <CardTitle>Commission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Your Commission Split</h4>
                <div className="h-5 w-full flex rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{
                      width: `${agentPortionPercentage}%`
                    }}
                  ></div>
                  <div 
                    className="bg-white h-full" 
                    style={{
                      width: `${agencyPortionPercentage}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Your Share ({agentPortionPercentage}%)</span>
                  <span>Agency ({agencyPortionPercentage}%)</span>
                </div>
              </div>
              
              <div className="bg-[#1a2336] p-4 rounded-md">
                <h3 className="text-sm font-semibold flex items-center gap-1 mb-2">
                  <Award className="h-4 w-4" />
                  {agentTier} Commission Split
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                  Your commission split rate is {agentPortionPercentage}/{agencyPortionPercentage} based on your tier.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">You: {agentPortionPercentage}%</span>
                  <span className="text-sm">Agency: {agencyPortionPercentage}%</span>
                </div>
              </div>
              
              {formData.coBroking?.enabled && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-2">Inter-Agency Split</h4>
                  <div className="h-5 w-full flex rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{
                        width: `${formData.coBroking.commissionSplit}%`
                      }}
                    ></div>
                    <div 
                      className="bg-orange-500 h-full" 
                      style={{
                        width: `${100 - formData.coBroking.commissionSplit}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Our Agency ({formData.coBroking.commissionSplit}%)</span>
                    <span>Co-Broker ({100 - formData.coBroking.commissionSplit}%)</span>
                  </div>
                </div>
              )}
              
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Total Commission:</span>
                  <span className="text-sm font-bold">{formatCurrency(totalCommission)}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Your Share:</span>
                  <span className="text-sm">{formatCurrency(commissionBreakdown.agentShare)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Agency Share:</span>
                  <span className="text-sm">{formatCurrency(commissionBreakdown.agencyShare)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculation;
