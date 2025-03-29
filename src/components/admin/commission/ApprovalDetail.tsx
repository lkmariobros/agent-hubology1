
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import useCommissionApproval, { 
  CommissionApproval
} from '@/hooks/useCommissionApproval';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from './StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';
import ApprovalHistory from '@/components/commission/ApprovalHistory';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import CommentsSection from './CommentsSection';
import { toast } from 'sonner';

interface ApprovalDetailProps {
  id: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const { useCommissionApprovalDetail, useUpdateApprovalStatusMutation } = useCommissionApproval;
  const { data, isLoading, error } = useCommissionApprovalDetail(id);
  const updateStatusMutation = useUpdateApprovalStatusMutation();
  const [statusNotes, setStatusNotes] = React.useState('');
  const [newStatus, setNewStatus] = React.useState<string>('');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
              <h2 className="text-lg font-medium">Error Loading Approval</h2>
              <p className="text-muted-foreground mb-4">
                Could not load the approval details. Please try again.
              </p>
              <Button onClick={() => navigate('/admin/commissions')}>
                Return to Commission Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const approval = data.approval || {} as CommissionApproval;
  const history = data.history || [];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleStatusChange = async () => {
    if (!newStatus) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        approvalId: id,
        newStatus: newStatus,
        notes: statusNotes.trim() ? statusNotes : undefined
      });
      
      // Show success toast
      toast.success(`Status updated to ${newStatus}`, {
        description: "The commission approval status has been updated successfully."
      });
      
      // Reset form after successful update
      setNewStatus('');
      setStatusNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };
  
  const getStatusOptions = () => {
    const currentStatus = approval.status;
    
    switch (currentStatus) {
      case 'Pending':
        return ['Under Review', 'Approved', 'Rejected'];
      case 'Under Review':
        return ['Approved', 'Rejected'];
      case 'Approved':
        return ['Ready for Payment', 'Rejected'];
      case 'Ready for Payment':
        return ['Paid', 'Rejected'];
      case 'Rejected':
        return ['Pending', 'Under Review'];
      case 'Paid':
        return [];
      default:
        return [];
    }
  };
  
  const statusOptions = getStatusOptions();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/commissions')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Commission Approval Details</h1>
        </div>
        <StatusBadge status={approval.status} />
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                  Submitted on {formatDate(approval.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {approval.transaction && (
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Commission Amount</h3>
                          <p className="text-lg font-semibold">
                            {formatCurrency(approval.transaction.commission_amount)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction Date</h3>
                          <p>{formatDate(approval.transaction.transaction_date)}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {approval.threshold_exceeded && (
                    <div className="p-3 bg-amber-50 rounded-md border border-amber-200 flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        This commission exceeds the approval threshold and requires additional verification.
                      </p>
                    </div>
                  )}
                  
                  {approval.notes && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notes</h3>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {approval.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                {statusOptions.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Change Status
                      </label>
                      <Select 
                        value={newStatus} 
                        onValueChange={(value) => setNewStatus(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">
                        Notes (Optional)
                      </label>
                      <Textarea
                        placeholder="Add notes about this status change"
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleStatusChange} 
                      disabled={!newStatus || updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      This approval is in its final state ({approval.status}) and cannot be updated further.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <ApprovalHistory history={history} />
        </TabsContent>
        
        <TabsContent value="comments" className="mt-6">
          <CommentsSection approvalId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalDetail;
