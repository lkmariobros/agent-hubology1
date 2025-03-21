
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCommissionApprovalDetail, useAddApprovalComment } from '@/hooks/useCommissionApproval';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Banknote, 
  MessageSquare, 
  X,
  CalendarClock
} from 'lucide-react';
import { toast } from 'sonner';

interface ApprovalStatusProps {
  transactionId: string;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ transactionId }) => {
  const [comment, setComment] = React.useState('');
  const [userId, setUserId] = React.useState<string | null>(null);
  
  // Get current user ID
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    getCurrentUser();
  }, []);
  
  // Fetch approval data
  const { data, isLoading, error } = useCommissionApprovalDetail(transactionId, false);
  const addCommentMutation = useAddApprovalComment();
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="ml-3 text-sm text-muted-foreground">Loading approval status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data?.approval) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No approval information found for this transaction.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { approval, history, comments } = data;
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
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
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Handle comment submission
  const handleSubmitComment = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    addCommentMutation.mutate({
      approvalId: approval.id,
      content: comment
    }, {
      onSuccess: () => {
        setComment('');
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Approval Status</CardTitle>
        <CardDescription>
          Track the status of your commission approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current status */}
        <div className="flex flex-col items-center pb-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(approval.status)}`}>
            {getStatusIcon(approval.status)}
            <span className="ml-1.5">{approval.status}</span>
          </span>
          
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {formatDate(approval.updated_at)}
          </p>
        </div>
        
        <Separator />
        
        {/* Status message */}
        <div className="px-1">
          <p className="text-sm font-medium mb-2">Current Status:</p>
          
          {approval.status === 'Pending' && (
            <p className="text-sm">
              Your commission is pending approval. A team member will review it shortly.
            </p>
          )}
          
          {approval.status === 'Under Review' && (
            <p className="text-sm">
              Your commission is currently under review. This may take a bit longer as it requires
              additional verification.
            </p>
          )}
          
          {approval.status === 'Approved' && (
            <p className="text-sm">
              Your commission has been approved! It has been queued for payment processing.
            </p>
          )}
          
          {approval.status === 'Ready for Payment' && (
            <p className="text-sm">
              Your commission is ready for payment and will be processed in the next payment cycle.
            </p>
          )}
          
          {approval.status === 'Paid' && (
            <p className="text-sm">
              Your commission has been paid. Please check your payment records.
            </p>
          )}
          
          {approval.status === 'Rejected' && (
            <p className="text-sm">
              Your commission has been rejected. Please contact an administrator for more details.
            </p>
          )}
          
          {approval.notes && (
            <div className="mt-3 bg-muted rounded p-3">
              <p className="text-xs font-medium">Notes:</p>
              <p className="text-xs mt-1">{approval.notes}</p>
            </div>
          )}
        </div>
        
        {/* Status history */}
        {history.length > 0 && (
          <>
            <Separator />
            
            <div>
              <p className="text-sm font-medium mb-3">History:</p>
              
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="text-xs">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.new_status)}`}>
                        {getStatusIcon(item.new_status)}
                        <span className="ml-1">{item.new_status}</span>
                      </span>
                      <span className="text-muted-foreground ml-2">
                        from {item.previous_status || 'Initial Status'}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mt-1 flex items-center">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      {formatDate(item.created_at)}
                    </p>
                    
                    {item.notes && (
                      <p className="mt-1 bg-muted/50 p-1.5 rounded">
                        {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Comments */}
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Comments ({comments.length})</p>
          </div>
          
          {comments.length > 0 ? (
            <div className="mt-3 space-y-3 max-h-[200px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 rounded p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-medium">
                      {comment.created_by === userId ? 'You' : 'Admin'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              No comments yet.
            </p>
          )}
          
          {/* Add comment */}
          <div className="mt-4">
            <Textarea
              placeholder="Add a comment or question about this approval..."
              className="min-h-[80px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button 
              size="sm"
              className="mt-2"
              onClick={handleSubmitComment}
              disabled={!comment.trim() || addCommentMutation.isPending}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {addCommentMutation.isPending ? 'Sending...' : 'Send Comment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalStatus;
