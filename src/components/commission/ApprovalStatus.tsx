
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCommissionApprovals } from '@/hooks/useCommissionApproval';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Banknote } from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';

interface ApprovalStatusProps {
  transactionId?: string;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ transactionId }) => {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useCommissionApprovals(
    undefined, // Get all statuses
    false, // Not admin
    user?.id,
    1,
    10
  );
  
  // Filter by transaction ID if provided
  const approvals = data?.approvals.filter(approval => 
    !transactionId || approval.transaction_id === transactionId
  ) || [];
  
  // Get status badge style
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Ready for Payment':
        return 'bg-purple-100 text-purple-800';
      case 'Paid':
        return 'bg-gray-100 text-gray-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Under Review':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Ready for Payment':
        return <Banknote className="h-4 w-4" />;
      case 'Paid':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Get status description
  const getStatusDescription = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'Your commission is pending review by the administrator.';
      case 'Under Review':
        return 'Your commission is currently being reviewed by the administrator.';
      case 'Approved':
        return 'Your commission has been approved and is awaiting payment processing.';
      case 'Ready for Payment':
        return 'Your commission has been processed and is ready for payment.';
      case 'Paid':
        return 'Your commission has been paid.';
      case 'Rejected':
        return 'Your commission has been rejected. Please contact your administrator for more information.';
      default:
        return 'Unknown status';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Commission Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || approvals.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Commission Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              {error ? 
                'Error loading approval status. Please try again later.' : 
                transactionId ? 
                  'No approval information found for this transaction.' :
                  'You do not have any commission approvals to display.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Commission Approval Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(approval.status)}`}>
                    {getStatusIcon(approval.status)}
                    <span className="ml-1">{approval.status}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Updated: {formatDate(approval.updated_at)}
                  </span>
                </div>
                <span className="font-medium">
                  {formatCurrency(approval.property_transactions.commission_amount)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getStatusDescription(approval.status)}
              </p>
              
              {approval.notes && (
                <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                  <p className="font-medium mb-1">Notes:</p>
                  <p className="text-muted-foreground">{approval.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalStatus;
