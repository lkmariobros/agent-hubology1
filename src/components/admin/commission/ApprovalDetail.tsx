import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useCommissionApprovalDetail, 
  useUpdateApprovalStatus,
  useAddApprovalComment,
  useDeleteApprovalComment,
  useSystemConfiguration
} from '@/hooks/useCommissionApproval';
import { useSendNotification } from '@/hooks/useSendNotification';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApprovalWorkflow from './ApprovalWorkflow';
import {
  ArrowLeft,
  CheckCircle,
  Ban,
  MessageSquare,
  Clock,
  CalendarClock,
  MoreHorizontal,
  AlertTriangle,
  GripHorizontal,
  Trash2,
  Banknote,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from './StatusBadge';

// Update the prop name from approvalId to id
interface ApprovalDetailProps {
  id?: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id: approvalId }) => {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [targetStatus, setTargetStatus] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  
  // Use the approvalId prop or the id from the URL params
  const currentApprovalId = approvalId || urlId;
  
  // Get approval details with history and comments
  const { data, isLoading, error } = useCommissionApprovalDetail(currentApprovalId, true);
  
  // Get threshold configuration
  const { data: thresholdConfig } = useSystemConfiguration('commission_approval_threshold');
  
  // Mutations for updating status, adding comments, and deleting comments
  const updateStatusMutation = useUpdateApprovalStatus();
  const addCommentMutation = useAddApprovalComment();
  const deleteCommentMutation = useDeleteApprovalComment();
  
  // Add the sendNotification hook
  const sendNotification = useSendNotification();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3">Loading approval details...</p>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading approval details. Please try again.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/admin/commission/approvals')}
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  const { approval, history, comments } = data;
  
  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };
  
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
  
  // Get initials for avatar
  const getInitials = (name: string = 'User') => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };
  
  // Handle comment submission
  const handleSubmitComment = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    addCommentMutation.mutate({
      approvalId: currentApprovalId as string,
      content: comment
    }, {
      onSuccess: () => {
        setComment('');
      }
    });
  };
  
  // Handle status update with notification
  const handleStatusUpdate = () => {
    if (!targetStatus) return;
    
    updateStatusMutation.mutate({
      approvalId: currentApprovalId as string,
      status: targetStatus,
      notes: statusNotes
    }, {
      onSuccess: () => {
        setStatusNotes('');
        setTargetStatus(null);
        setIsStatusDialogOpen(false);
        
        // Send notification to the agent
        if (approval.submitted_by) {
          const notificationTitle = `Commission ${targetStatus}`;
          let notificationMessage = '';
          
          switch (targetStatus) {
            case 'Approved':
              notificationMessage = `Your commission for transaction #${approval.transaction_id} has been approved.`;
              break;
            case 'Rejected':
              notificationMessage = `Your commission for transaction #${approval.transaction_id} has been rejected. ${statusNotes ? `Reason: ${statusNotes}` : ''}`;
              break;
            case 'Under Review':
              notificationMessage = `Your commission for transaction #${approval.transaction_id} is now under review.`;
              break;
            case 'Ready for Payment':
              notificationMessage = `Your commission for transaction #${approval.transaction_id} is now ready for payment.`;
              break;
            case 'Paid':
              notificationMessage = `Your commission for transaction #${approval.transaction_id} has been paid.`;
              break;
            default:
              notificationMessage = `Your commission status has been updated to ${targetStatus}.`;
          }
          
          sendNotification.mutate({
            userId: approval.submitted_by,
            type: 'approval',
            title: notificationTitle,
            message: notificationMessage,
            data: {
              approvalId: approval.id,
              transactionId: approval.transaction_id,
              status: targetStatus
            }
          });
        }
      }
    });
  };
  
  // Handle delete comment
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate({
        commentId,
        approvalId: currentApprovalId as string
      });
    }
  };
  
  // Status controls based on current status
  const renderStatusControls = () => {
    const currentStatus = approval.status;
    
    const openStatusDialog = (status: string) => {
      setTargetStatus(status);
      setIsStatusDialogOpen(true);
    };
    
    switch (currentStatus) {
      case 'Pending':
        return (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => openStatusDialog('Under Review')}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Start Review
            </Button>
            <Button variant="secondary" onClick={() => openStatusDialog('Approved')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button variant="destructive" onClick={() => openStatusDialog('Rejected')}>
              <Ban className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        );
      
      case 'Under Review':
        return (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => openStatusDialog('Approved')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button variant="destructive" onClick={() => openStatusDialog('Rejected')}>
              <Ban className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        );
        
      case 'Approved':
        return (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => openStatusDialog('Ready for Payment')}>
              <Banknote className="h-4 w-4 mr-2" />
              Mark Ready for Payment
            </Button>
          </div>
        );
        
      case 'Ready for Payment':
        return (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => openStatusDialog('Paid')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin/commission/approvals')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Commission Approval
              <StatusBadge status={approval.status} />
            </h1>
            <p className="text-muted-foreground">
              Transaction ID: {approval.transaction_id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => window.print()}
              >
                Print Approval Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate(`/transactions/${approval.transaction_id}`)}
              >
                View Original Transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
          <CardDescription>Track the current status in the approval process</CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalWorkflow currentStatus={approval.status} />
        </CardContent>
      </Card>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">
                History
                <span className="ml-1 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                  {history?.length || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                <span className="ml-1 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                  {comments?.length || 0}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription>
                    Information about the associated transaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Property</p>
                      <p className="text-base">
                        {approval.property_transactions.property_id || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transaction Date</p>
                      <p className="text-base">
                        {formatDate(approval.property_transactions.transaction_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transaction Value</p>
                      <p className="text-base">
                        {formatCurrency(approval.property_transactions.transaction_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Commission Amount</p>
                      <p className="text-base font-semibold">
                        {formatCurrency(approval.property_transactions.commission_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Commission Rate</p>
                      <p className="text-base">
                        {approval.property_transactions.commission_rate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Agent</p>
                      <p className="text-base">
                        {approval.property_transactions.agent_id || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</p>
                    <p className="text-sm">
                      {approval.property_transactions.notes || 'No additional notes provided.'}
                    </p>
                  </div>
                  
                  {approval.threshold_exceeded && thresholdConfig && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded p-4 flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-yellow-800">Threshold Exceeded</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This commission exceeds the approval threshold of {formatCurrency(parseFloat(thresholdConfig))} and requires additional verification.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {renderStatusControls()}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Approval History</CardTitle>
                  <CardDescription>
                    Timeline of status changes and actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No history records found for this approval.
                    </p>
                  ) : (
                    <div className="relative pl-6 border-l pt-2">
                      {history.map((event, index) => (
                        <div 
                          key={event.id} 
                          className={`relative pb-8 ${index === history.length - 1 ? '' : ''}`}
                        >
                          <div className="absolute -left-3 mt-1.5 h-5 w-5 rounded-full border bg-card flex items-center justify-center">
                            <GripHorizontal className="h-3 w-3 text-muted-foreground" />
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <StatusBadge status={event.new_status} size="sm" />
                              <span className="ml-2 text-sm text-muted-foreground">
                                from {event.previous_status || 'Initial Status'}
                              </span>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                              <CalendarClock className="h-3 w-3 mr-1" />
                              {formatDate(event.created_at)}
                            </p>
                            
                            {event.notes && (
                              <p className="text-sm mt-2 bg-muted/50 p-2 rounded">
                                {event.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Discussion and notes about this approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">User {comment.created_by.slice(0, 6)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            </div>
                            
                            <p className="text-sm mt-2">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <div className="pt-2">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[100px]"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button 
                        className="mt-2"
                        onClick={handleSubmitComment}
                        disabled={!comment.trim() || addCommentMutation.isPending}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Approval Status</CardTitle>
              <CardDescription>
                Current status and next steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center py-4">
                  <StatusBadge status={approval.status} size="lg" />
                  
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Last updated {formatDate(approval.updated_at)}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-1">Next Steps:</p>
                  
                  {approval.status === 'Pending' && (
                    <Alert className="mt-2">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Begin review by clicking "Start Review" or approve/reject directly if decision is clear.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {approval.status === 'Under Review' && (
                    <Alert className="mt-2">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        After verifying all details, either approve or reject this commission.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {approval.status === 'Approved' && (
                    <Alert className="mt-2">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Click "Mark Ready for Payment" to notify the finance department.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {approval.status === 'Ready for Payment' && (
                    <Alert className="mt-2">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Once payment has been processed, mark as "Paid" to complete the workflow.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {approval.status === 'Paid' && (
                    <p className="text-sm">
                      This commission has been paid. No further action is required.
                    </p>
                  )}
                  
                  {approval.status === 'Rejected' && (
                    <p className="text-sm">
                      This commission has been rejected. No further action is required.
                    </p>
                  )}
                </div>
                
                <div className="bg-muted rounded p-3">
                  <p className="text-xs font-medium">Notes:</p>
                  <p className="text-xs mt-1">
                    {approval.notes || 'No additional notes.'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {renderStatusControls()}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Status update dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Approval Status</DialogTitle>
            <DialogDescription>
              Change the status from <StatusBadge status={approval.status} size="sm" /> to <StatusBadge status={targetStatus || ''} size="sm" />
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="statusNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="statusNotes"
                placeholder="Enter any relevant notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalDetail;
