
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Trash, Loader2 } from 'lucide-react';
import { 
  useAddCommissionApprovalComment,
  useDeleteCommissionApprovalComment 
} from '@/hooks/useCommissionApproval';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { CommissionApprovalComment } from '@/types';

interface CommentsSectionProps {
  approvalId: string;
  comments: CommissionApprovalComment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ approvalId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const { user, isAdmin } = useAuth();
  const addCommentMutation = useAddCommissionApprovalComment();
  const deleteCommentMutation = useDeleteCommissionApprovalComment();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await addCommentMutation.mutateAsync({
        approvalId,
        content: newComment.trim()
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };
  
  const handleDelete = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">
                      {comment.user?.name || 'User'}
                    </div>
                    {(user?.id === comment.created_by || isAdmin) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteCommentMutation.isPending}
                      >
                        {deleteCommentMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No comments yet</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-24 resize-none"
            />
            <Button
              type="submit"
              className="mt-2"
              disabled={!newComment.trim() || addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
