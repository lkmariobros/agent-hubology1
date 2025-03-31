
import React from 'react';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  CalendarClock, 
  DollarSign 
} from 'lucide-react';
import ApprovalHistory from './ApprovalHistory';
import ApprovalStatusUpdater from './ApprovalStatusUpdater';
import { CommentsSection } from './CommentsSection';
import { formatCurrency } from '@/lib/utils';

// Helper function to get the status icon based on status
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'under review':
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'ready for payment':
      return <DollarSign className="h-4 w-4 text-emerald-500" />;
    case 'paid':
      return <CheckCircle className="h-4 w-4 text-indigo-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <CalendarClock className="h-4 w-4 text-gray-500" />;
  }
};

const ApprovalDetail = () => {
  const commissionApprovalHooks = useCommissionApproval();
  const { 
    approval, 
    approvalId,
    isLoading, 
    refetch 
  } = commissionApprovalHooks.useCommissionApprovalDetail();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium">No approval found</h3>
        <p className="text-muted-foreground">The requested approval could not be found or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            Commission Approval #{approval.id?.substring(0, 8)}
          </h2>
          <p className="text-muted-foreground">
            Created on {new Date(approval.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="flex items-center gap-1 px-3 py-1">
            {getStatusIcon(approval.status)}
            <span className="capitalize">{approval.status}</span>
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Commission Amount</p>
                <p className="text-lg font-medium">{formatCurrency(approval.amount || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction Date</p>
                <p className="text-lg font-medium">
                  {approval.transaction_date ? 
                    new Date(approval.transaction_date).toLocaleDateString() : 
                    'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent</p>
                <p className="text-lg font-medium">{approval.agent_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction</p>
                <p className="text-lg font-medium truncate">
                  {approval.property_transaction || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="text-lg font-medium truncate">
                  {approval.property_name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Schedule</p>
                <p className="text-lg font-medium">
                  {approval.payment_schedule_id ? 
                    `#${approval.payment_schedule_id.substring(0, 8)}` : 
                    'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approval Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ApprovalStatusUpdater 
              approval={approval} 
              onStatusUpdate={() => refetch()} 
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Approval Notes</h3>
              <p className="text-muted-foreground text-sm">
                {approval.notes || 'No notes added for this approval.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="history">Status History</TabsTrigger>
        </TabsList>
        <TabsContent value="comments" className="p-4 bg-card rounded-md border mt-2">
          <CommentsSection approvalId={approvalId} />
        </TabsContent>
        <TabsContent value="history" className="p-4 bg-card rounded-md border mt-2">
          <ApprovalHistory approvalId={approvalId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalDetail;
