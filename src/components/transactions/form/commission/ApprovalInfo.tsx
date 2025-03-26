
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useSystemConfiguration } from '@/hooks/useCommissionApproval';

interface ApprovalInfoProps {
  commissionAmount: number;
  status?: string;
}

const ApprovalInfo: React.FC<ApprovalInfoProps> = ({
  commissionAmount,
  status = 'pending'
}) => {
  // Get the threshold value from system configuration
  const {
    data: thresholdValue,
    isLoading
  } = useSystemConfiguration('commission_approval_threshold');

  // Parse the threshold value
  const threshold = thresholdValue ? parseFloat(thresholdValue) : 10000;
  const exceedsThreshold = commissionAmount > threshold;

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // If still loading the threshold value
  if (isLoading) {
    return <Card>
        <CardHeader>
          <CardTitle>Commission Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p>Loading approval information...</p>
          </div>
        </CardContent>
      </Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Approval</CardTitle>
      </CardHeader>
      <CardContent>
        {exceedsThreshold ? (
          <Alert variant="warning" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Approval Required</AlertTitle>
            <AlertDescription>
              This commission amount ({formatCurrency(commissionAmount)}) exceeds the threshold of {formatCurrency(threshold)} and will require approval.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="mb-2 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>No Approval Required</AlertTitle>
            <AlertDescription>
              This commission amount ({formatCurrency(commissionAmount)}) is below the threshold and does not require additional approval.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalInfo;
