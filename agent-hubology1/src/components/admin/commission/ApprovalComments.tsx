
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Send, Trash2, Loader2 } from 'lucide-react';

interface ApprovalComment {
  id: string;
  approval_id: string;
  created_by: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

interface ApprovalCommentsProps {
  approvalId: string;
  comments: ApprovalComment[];
  isLoading: boolean;
  onAddComment: (comment: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  currentUserId?: string;
}

const ApprovalComments: React.FC<ApprovalCommentsProps> = ({
  approvalId,
  comments,
  isLoading,
  onAddComment,
  onDeleteComment,
  currentUserId,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (commentId: string) => {
    if (!onDeleteComment) return;
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await onDeleteComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };
  
  const getInitials = (name: string = 'User') => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No comments yet. Start the discussion.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(comment.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{comment.user_name || 'Unknown User'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
                    </div>
                    {onDeleteComment && currentUserId === comment.created_by && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete comment</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[60px]"
          />
          <Button 
            type="submit" 
            className="mt-auto" 
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApprovalComments;
