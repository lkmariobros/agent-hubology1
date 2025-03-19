
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AgentWithHierarchy, OverrideCommission } from '@/types';
import { calculateCommission, calculateOverrideCommissions } from '@/hooks/useCommission';

interface CommissionCalculatorProps {
  agent: AgentWithHierarchy;
  commissionRate: number;
}

const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({ agent, commissionRate }) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(500000);
  const [baseCommission, setBaseCommission] = useState<number>(0);
  const [overrideCommissions, setOverrideCommissions] = useState<OverrideCommission[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate base commission
    const commission = calculateCommission(propertyPrice, commissionRate);
    setBaseCommission(commission);
    
    // Calculate override commissions
    const overrides = calculateOverrideCommissions(commission, agent);
    setOverrideCommissions(overrides);
  }, [propertyPrice, commissionRate, agent]);

  const totalCommission = baseCommission;
  const totalOverrides = overrideCommissions.reduce((sum, override) => sum + override.amount, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleCopyResults = () => {
    const results = `
      Transaction Amount: ${formatCurrency(propertyPrice)}
      Base Commission (${commissionRate}%): ${formatCurrency(baseCommission)}
      
      Override Commissions:
      ${overrideCommissions.map(override => 
        `${override.agentName} (${override.rank}): ${formatCurrency(override.amount)} (${override.percentage}%)`
      ).join('\n')}
      
      Total Overrides: ${formatCurrency(totalOverrides)}
    `;
    
    navigator.clipboard.writeText(results);
    toast({
      title: "Copied to clipboard",
      description: "Commission calculation has been copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="property-price">Property Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
            <Input 
              id="property-price"
              type="number" 
              value={propertyPrice} 
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="pl-7"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-4">Commission Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Base Commission ({commissionRate}%)</span>
              <span className="font-bold">{formatCurrency(baseCommission)}</span>
            </div>
            
            {overrideCommissions.length > 0 && (
              <>
                <div className="pt-2 border-t">
                  <h4 className="text-sm font-medium mb-2">Override Commissions</h4>
                  
                  {overrideCommissions.map((override, index) => (
                    <div key={index} className="flex justify-between items-center py-1 text-sm">
                      <span>{override.agentName} ({override.rank}) - {override.percentage}%</span>
                      <span>{formatCurrency(override.amount)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-2 mt-2 border-t">
                    <span className="font-medium">Total Overrides</span>
                    <span className="font-bold">{formatCurrency(totalOverrides)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={handleCopyResults}
        >
          Copy Results
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommissionCalculator;
