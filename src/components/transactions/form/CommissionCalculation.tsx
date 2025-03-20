
import React, { useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { getDefaultCommissionRate } from '@/context/TransactionForm/initialState';
import { Calculator, Percent, DollarSign, Building, User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

const CommissionCalculation: React.FC = () => {
  const { state, updateFormData, calculateCommission } = useTransactionForm();
  const { formData, errors } = state;
  
  const commissionBreakdown = calculateCommission();
  
  // Update default commission rate when transaction type changes
  useEffect(() => {
    if (formData.commissionRate === 0) {
      const defaultRate = getDefaultCommissionRate(formData.transactionType);
      updateFormData({ commissionRate: defaultRate });
    }
  }, [formData.transactionType]);
  
  // Handler for transaction value changes
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({ transactionValue: value });
  };
  
  // Handler for commission rate changes
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    updateFormData({ commissionRate: rate });
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
  
  // Calculate share percentages for the pie chart
  const agencySharePercent = 30; // Fixed 30%
  const agentSharePercent = formData.coBroking.enabled
    ? 70 - (70 * formData.coBroking.commissionSplit / 100) // Adjusted for co-broking
    : 70; // Full 70% if no co-broking
  const coAgentSharePercent = formData.coBroking.enabled
    ? (70 * formData.coBroking.commissionSplit / 100)
    : 0;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Calculation</h2>
      <p className="text-muted-foreground">
        Set the transaction value and commission rate to calculate the commission breakdown.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="transactionValue" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Transaction Value
            </Label>
            <Input
              id="transactionValue"
              type="number"
              value={formData.transactionValue || ''}
              onChange={handleTransactionValueChange}
              placeholder="Enter transaction value"
              className={errors.transactionValue ? 'border-destructive' : ''}
            />
            {errors.transactionValue && (
              <p className="text-sm text-destructive mt-1">{errors.transactionValue}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="commissionRate" className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Commission Rate (%)
            </Label>
            <Tabs 
              defaultValue={formData.commissionRate.toString()} 
              onValueChange={(value) => updateFormData({ commissionRate: parseFloat(value) })}
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="1">1%</TabsTrigger>
                <TabsTrigger value="2">2%</TabsTrigger>
                <TabsTrigger value="3">3%</TabsTrigger>
                <TabsTrigger value="Custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="Custom" className="mt-2">
                <Input
                  id="commissionRate"
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={handleCommissionRateChange}
                  className={errors.commissionRate ? 'border-destructive' : ''}
                />
              </TabsContent>
            </Tabs>
            {errors.commissionRate && (
              <p className="text-sm text-destructive mt-1">{errors.commissionRate}</p>
            )}
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
              
              <div className="pt-2 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    Agency Share (30%):
                  </span>
                  <span className="font-medium">{formatCurrency(commissionBreakdown.agencyShare)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-4 w-4" />
                    Your Share ({agentSharePercent}%):
                  </span>
                  <span className="font-medium">{formatCurrency(commissionBreakdown.agentShare)}</span>
                </div>
                
                {formData.coBroking.enabled && commissionBreakdown.coAgentShare !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Co-Agent Share ({coAgentSharePercent}%):
                    </span>
                    <span className="font-medium">{formatCurrency(commissionBreakdown.coAgentShare)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Visual representation of the split */}
            <div className="mt-6">
              <div className="h-4 w-full flex rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full" 
                  style={{ width: `${agencySharePercent}%` }} 
                  title={`Agency: ${agencySharePercent}%`}
                ></div>
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${agentSharePercent}%` }}
                  title={`You: ${agentSharePercent}%`}
                ></div>
                {formData.coBroking.enabled && (
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${coAgentSharePercent}%` }}
                    title={`Co-Agent: ${coAgentSharePercent}%`}
                  ></div>
                )}
              </div>
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>Agency</span>
                <span>You</span>
                {formData.coBroking.enabled && <span>Co-Agent</span>}
              </div>
            </div>
            
            {/* Update commissionAmount for form data */}
            {(() => {
              updateFormData({ commissionAmount: commissionBreakdown.totalCommission });
              return null;
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommissionCalculation;
