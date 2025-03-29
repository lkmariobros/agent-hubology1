import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommissionApprovalComment, useAddApprovalComment, useDeleteApprovalComment } from '@/hooks/useCommissionApproval';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAuth from '@/hooks/useAuth';

interface CommentsSectionProps {
  approvalId: string;
  comments: CommissionApprovalComment[];
  isLoading?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ approvalId, comments, isLoading }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const addCommentMutation = useAddApprovalComment();
  const deleteCommentMutation = useDeleteApprovalComment();
  
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      await addCommentMutation.mutateAsync({
        approvalId,
        content: newComment
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteCommentMutation.mutateAsync({
          commentId,
          approvalId
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Generate user initials from email or ID
  const getUserInitials = (userString: string) => {
    if (!userString) return 'U';
    
    // If it's an email address
    if (userString.includes('@')) {
      const parts = userString.split('@')[0].split(/[._-]/);
      return parts.length > 1 
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : userString.slice(0, 2).toUpperCase();
    }
    
    // If it's a UUID
    return userString.slice(0, 2).toUpperCase();
  };
  
  const getUserColor = (userString: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-amber-500', 'bg-red-500', 'bg-indigo-500'
    ];
    
    // Simple hash for consistent color per user
    const hash = userString.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ScrollArea className="flex-grow mb-4 max-h-[400px]">
          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getUserColor(comment.created_by)}>
                      {getUserInitials(comment.created_by)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                      {user?.id === comment.created_by && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-sm text-muted-foreground">
              No comments yet
            </p>
          )}
        </ScrollArea>
        
        <div className="mt-auto">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] mb-2"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={addCommentMutation.isPending || !newComment.trim()}
            >
              {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
