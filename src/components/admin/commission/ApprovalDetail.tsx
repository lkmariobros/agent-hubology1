import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  useCommissionApprovalDetail, 
  useUpdateApprovalStatus,
  useAddApprovalComment,
  CommissionApprovalHistory
} from '@/hooks/useCommissionApproval';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/propertyUtils';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import ApprovalWorkflow from './ApprovalWorkflow';
import ApprovalHistory from '@/components/commission/ApprovalHistory';
import { useCommissionNotifications } from '@/hooks/useCommissionNotifications';

interface ApprovalDetailProps {
  id: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id }) => {
  const { data, isLoading, error } = useCommissionApprovalDetail(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApprovalStatus();
  const { mutate: addComment, isPending: isAddingComment } = useAddApprovalComment();
  const [comment, setComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { createApprovalStatusNotification } = useCommissionNotifications();
  
  const approval = data?.approval;
  const history = data?.history as CommissionApprovalHistory[];
  const comments = data?.comments;
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle status changes
  const handleStatusChange = (newStatus: string) => {
    if (!approval) return;
    
    updateStatus({
      approvalId: approval.id,
      status: newStatus,
      notes: newStatus === 'Rejected' ? rejectReason : undefined
    }, {
      onSuccess: () => {
        toast({
          title: 'Status updated',
          description: `Status has been updated to ${newStatus}`,
        });
        
        // Send notification to agent
        if (approval.submitted_by) {
          createApprovalStatusNotification(
            approval.submitted_by,
            newStatus,
            approval.property_transactions.commission_amount,
            approval.transaction_id,
            approval.id
          );
        }
        
        // Close reject dialog if open
        if (showRejectDialog) {
          setShowRejectDialog(false);
          setRejectReason('');
        }
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `Failed to update status: ${error.message}`,
          variant: 'destructive'
        });
      }
    });
  };
  
  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!comment.trim() || !approval) return;
    
    addComment({
      approvalId: approval.id,
      content: comment
    }, {
      onSuccess: () => {
        setComment('');
        toast({
          title: 'Comment added',
          description: 'Your comment has been added to the approval',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `Failed to add comment: ${error.message}`,
          variant: 'destructive'
        });
      }
    });
  };
  
  // Get available actions based on current status
  const getAvailableActions = (status: string) => {
    switch (status) {
      case 'Pending':
        return [
          { label: 'Start Review', action: 'Under Review', color: 'bg-blue-500 hover:bg-blue-600' },
          { label: 'Reject', action: 'reject', color: 'bg-red-500 hover:bg-red-600' }
        ];
      case 'Under Review':
        return [
          { label: 'Approve', action: 'Approved', color: 'bg-green-500 hover:bg-green-600' },
          { label: 'Reject', action: 'reject', color: 'bg-red-500 hover:bg-red-600' }
        ];
      case 'Approved':
        return [
          { label: 'Ready for Payment', action: 'Ready for Payment', color: 'bg-purple-500 hover:bg-purple-600' },
          { label: 'Revert to Review', action: 'Under Review', color: 'bg-yellow-500 hover:bg-yellow-600' }
        ];
      case 'Ready for Payment':
        return [
          { label: 'Mark as Paid', action: 'Paid', color: 'bg-green-500 hover:bg-green-600' },
          { label: 'Revert to Approved', action: 'Approved', color: 'bg-yellow-500 hover:bg-yellow-600' }
        ];
      case 'Paid':
        return [];
      case 'Rejected':
        return [
          { label: 'Reopen for Review', action: 'Under Review', color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      default:
        return [];
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !approval) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Approval</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'The requested approval could not be found.'}
          </p>
          <Button onClick={() => navigate('/admin/commission')}>
            Return to Commission Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const availableActions = getAvailableActions(approval.status);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/commission')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Commission Approval Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Approval #{approval.id.slice(0, 8)}</CardTitle>
                  <CardDescription>Transaction #{approval.transaction_id.slice(0, 8)}</CardDescription>
                </div>
                <Badge className={`
                  ${approval.status === 'Approved' || approval.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                  ${approval.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${approval.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : ''}
                  ${approval.status === 'Ready for Payment' ? 'bg-purple-100 text-purple-800' : ''}
                  ${approval.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {approval.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ApprovalWorkflow currentStatus={approval.status} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Commission Amount</h3>
                    <p className="text-2xl font-bold">{formatCurrency(approval.property_transactions.commission_amount)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction Value</h3>
                    <p className="text-2xl font-bold">{formatCurrency(approval.property_transactions.transaction_value)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Commission Rate</h3>
                    <p className="text-lg">{approval.property_transactions.commission_rate}%</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction Date</h3>
                    <p className="text-lg">{formatDate(approval.property_transactions.transaction_date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted By</h3>
                    <p className="text-lg">{approval.agent?.name || (typeof approval.submitted_by === 'object' ? 'Unknown' : approval.submitted_by)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted On</h3>
                    <p className="text-lg">{formatDate(approval.created_at)}</p>
                  </div>
                </div>
                
                {approval.notes && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="text-sm font-medium mb-1">Notes</h3>
                    <p className="text-muted-foreground">{approval.notes}</p>
                  </div>
                )}
                
                {availableActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {availableActions.map((action) => (
                      <Button
                        key={action.action}
                        className={action.color}
                        disabled={isUpdating}
                        onClick={() => {
                          if (action.action === 'reject') {
                            setShowRejectDialog(true);
                          } else {
                            handleStatusChange(action.action);
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
              <CardDescription>
                Add comments and notes to this approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments && comments.length > 0 ? (
                  <div className="space-y-4 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between">
                          <p className="font-medium">{comment.created_by}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</p>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No comments yet</p>
                )}
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleCommentSubmit} 
                    disabled={!comment.trim() || isAddingComment}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <ApprovalHistory history={history || []} isLoading={isLoading} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              {approval.property_transactions.property_id ? (
                <div className="space-y-2">
                  <p>Property ID: {approval.property_transactions.property_id}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/admin/properties/${approval.property_transactions.property_id}`)}
                  >
                    View Property
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No property details available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Commission Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this commission approval. This information will be shared with the agent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="my-4"
            rows={4}
          />
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusChange('Rejected')}
              className="bg-red-500 hover:bg-red-600"
              disabled={!rejectReason.trim()}
            >
              Reject Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApprovalDetail;
