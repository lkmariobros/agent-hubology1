
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import useCommissionApproval, {
  ApprovalComment
} from '@/hooks/useCommissionApproval';
import useAuth from '@/hooks/useAuth';

interface CommentsSectionProps {
  approvalId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ approvalId }) => {
  const { useApprovalComments, useAddApprovalCommentMutation, useDeleteApprovalCommentMutation } = useCommissionApproval;
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  
  const { data: comments = [], isLoading } = useApprovalComments(approvalId);
  const addCommentMutation = useAddApprovalCommentMutation();
  const deleteCommentMutation = useDeleteApprovalCommentMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      await addCommentMutation.mutateAsync({
        approvalId,
        comment: comment.trim()
      });
      
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleDelete = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({
        commentId,
        approvalId
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div>
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Textarea
            placeholder="Add your comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={addCommentMutation.isPending}
          />
          <Button 
            type="submit" 
            className="self-end"
            disabled={!comment.trim() || addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Comment
              </>
            )}
          </Button>
        </form>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((item: ApprovalComment) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {item.user_name ? item.user_name.slice(0, 2).toUpperCase() : 'UN'}
                      </AvatarFallback>
                      {/* Add logic to load avatar from user if available */}
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.user_name || 'Unknown User'}</h3>
                        <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                      </div>
                      <p className="mt-2">{item.comment}</p>
                    </div>
                  </div>
                  
                  {user?.id === item.created_by && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment.</p>
      )}
    </div>
  );
};

export default CommentsSection;
