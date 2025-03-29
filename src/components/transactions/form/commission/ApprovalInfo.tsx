
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import useCommissionApproval from '@/hooks/useCommissionApproval';

interface ApprovalInfoProps {
  commissionAmount: number;
}

const ApprovalInfo: React.FC<ApprovalInfoProps> = ({ commissionAmount }) => {
  const { useSystemConfiguration, useCommissionApprovalCheck } = useCommissionApproval;
  const { data: thresholdConfig } = useSystemConfiguration('commission_approval_threshold');
  const { requiresApproval } = useCommissionApprovalCheck(commissionAmount);
  
  // Get threshold from config or use default
  const threshold = thresholdConfig?.value ? parseInt(thresholdConfig.value, 10) : 10000;
  
  return (
    <Card>
      <CardContent className="p-4">
        {requiresApproval ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Approval Required</AlertTitle>
            <AlertDescription>
              This commission amount (${commissionAmount.toLocaleString()}) exceeds the threshold of ${threshold.toLocaleString()} and will require approval before processing.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>No Approval Required</AlertTitle>
            <AlertDescription>
              This commission amount (${commissionAmount.toLocaleString()}) is below the threshold of ${threshold.toLocaleString()} and does not require additional approval.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalInfo;
