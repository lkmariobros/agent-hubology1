
import React from 'react';
import { useSystemConfiguration } from '@/hooks/useCommissionApproval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ApprovalInfoProps {
  commissionAmount: number;
}

const ApprovalInfo: React.FC<ApprovalInfoProps> = ({ commissionAmount }) => {
  const { data: thresholdConfig, isLoading } = useSystemConfiguration('commission_approval_threshold');
  
  if (isLoading) {
    return null;
  }
  
  const threshold = thresholdConfig ? parseFloat(thresholdConfig) : 10000;
  const exceedsThreshold = commissionAmount > threshold;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Commission Approval Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className={`flex items-start gap-3 p-3 rounded-md ${exceedsThreshold ? 'bg-yellow-50' : 'bg-green-50'}`}>
            {exceedsThreshold ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            
            <div>
              <p className={`font-medium ${exceedsThreshold ? 'text-yellow-800' : 'text-green-800'}`}>
                {exceedsThreshold ? 'Additional Approval Required' : 'Standard Approval Process'}
              </p>
              
              <p className={`text-sm mt-1 ${exceedsThreshold ? 'text-yellow-700' : 'text-green-700'}`}>
                {exceedsThreshold
                  ? `This commission amount (${formatCurrency(commissionAmount)}) exceeds the threshold of ${formatCurrency(threshold)} and will require additional verification.`
                  : `This commission amount (${formatCurrency(commissionAmount)}) falls within the standard approval threshold of ${formatCurrency(threshold)}.`
                }
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p>
                All transactions are subject to approval before commission payment. When this transaction is marked as completed, it will be automatically submitted to the approval workflow.
              </p>
              <p className="mt-1">
                You will be able to track the approval status in the transaction details page.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalInfo;
