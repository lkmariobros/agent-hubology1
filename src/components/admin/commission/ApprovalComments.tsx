
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { toast } from 'sonner';

interface ApprovalCommentsProps {
  approvalId: string;
}

const ApprovalComments: React.FC<ApprovalCommentsProps> = ({
  approvalId
}) => {
  const [comment, setComment] = useState('');
  const { 
    useApprovalComments, 
    useAddApprovalCommentMutation 
  } = useCommissionApproval();
  
  const { data: comments, isLoading } = useApprovalComments(approvalId);
  const { mutateAsync: addComment, isPending: isAddingComment } = useAddApprovalCommentMutation();
  
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await addComment({ approvalId, comment });
      setComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };
  
  if (isLoading) {
    return <LoadingIndicator text="Loading comments..." />;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments</h3>
      
      <div className="space-y-4 max-h-60 overflow-y-auto p-2">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-muted p-3 rounded-md">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{comment.created_by_name || 'User'}</span>
                <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm">{comment.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No comments yet</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <Button 
          onClick={handleAddComment} 
          disabled={!comment.trim() || isAddingComment}
          className="w-full"
        >
          {isAddingComment ? (
            <LoadingIndicator size="sm" variant="inline" text="Adding..." />
          ) : (
            'Add Comment'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApprovalComments;
