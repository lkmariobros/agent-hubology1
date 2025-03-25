
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
  const { data: thresholdValue, isLoading } = useSystemConfiguration('commission_approval_threshold');
  
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p>Loading approval information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Approval Information</CardTitle>
      </CardHeader>
      <CardContent>
        {exceedsThreshold ? (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Approval Required</AlertTitle>
            <AlertDescription>
              <p>
                This commission of {formatCurrency(commissionAmount)} exceeds the approval threshold 
                of {formatCurrency(threshold)} and will require management approval.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The approval process typically takes 1-2 business days. You will receive a notification
                once the status changes.
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>No Approval Required</AlertTitle>
            <AlertDescription>
              This commission is below the approval threshold of {formatCurrency(threshold)} and 
              does not require additional approval.
            </AlertDescription>
          </Alert>
        )}
        
        {status && status !== 'pending' && (
          <div className="mt-4 p-4 border rounded-md">
            <h4 className="font-medium mb-2">Current Status: {status}</h4>
            <p className="text-sm text-muted-foreground">
              The approval status will be updated automatically as it progresses through the workflow.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalInfo;
