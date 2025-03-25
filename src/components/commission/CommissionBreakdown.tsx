
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CommissionBreakdownProps {
  totalCommission: number;
  agencyShare: number;
  agentShare: number;
  agentTier: string;
  agentCommissionPercentage: number;
  coAgencyCommission?: number;
  transactionValue: number;
  commissionRate: number;
}

const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({
  totalCommission,
  agencyShare,
  agentShare,
  agentTier,
  agentCommissionPercentage,
  coAgencyCommission,
  transactionValue,
  commissionRate
}) => {
  // Prepare chart data
  const chartData = [
    {
      name: 'Agency',
      value: agencyShare,
      fill: '#94a3b8'
    },
    {
      name: 'Agent',
      value: agentShare,
      fill: '#3b82f6'
    }
  ];
  
  if (coAgencyCommission) {
    chartData.unshift({
      name: 'Co-Agency',
      value: coAgencyCommission,
      fill: '#f59e0b'
    });
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg">Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Transaction Summary */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Transaction Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction Value</p>
                <p className="text-lg font-bold">{formatCurrency(transactionValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
                <p className="text-lg font-bold">{commissionRate}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Total Commission</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalCommission)}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Chart Visualization */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis type="category" dataKey="name" />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(value) => `${value} Share`}
                />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <Separator />
          
          {/* Commission Split */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Commission Split</h3>
            
            {coAgencyCommission && (
              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                <div>
                  <p className="font-medium">Co-Agency Commission</p>
                  <p className="text-sm text-muted-foreground">
                    {((coAgencyCommission / totalCommission) * 100).toFixed(0)}% of total
                  </p>
                </div>
                <p className="text-lg font-bold">{formatCurrency(coAgencyCommission)}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/30 rounded-md">
              <div>
                <p className="font-medium">Agency Share</p>
                <p className="text-sm text-muted-foreground">
                  {((agencyShare / (totalCommission - (coAgencyCommission || 0))) * 100).toFixed(0)}% of our portion
                </p>
              </div>
              <p className="text-lg font-bold">{formatCurrency(agencyShare)}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
              <div>
                <p className="font-medium">Agent Share ({agentTier})</p>
                <p className="text-sm text-muted-foreground">
                  {agentCommissionPercentage}% tier rate
                </p>
              </div>
              <p className="text-lg font-bold">{formatCurrency(agentShare)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdown;
