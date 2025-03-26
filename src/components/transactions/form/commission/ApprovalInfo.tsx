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
  return;
};
export default ApprovalInfo;