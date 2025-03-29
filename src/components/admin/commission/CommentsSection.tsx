
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { CommissionApprovalComment, useApprovalComments, useAddApprovalComment, useDeleteApprovalComment } from '@/hooks/useCommissionApproval';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface CommentsSectionProps {
  approvalId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ approvalId }) => {
  const { data: comments = [], isLoading, error } = useApprovalComments(approvalId);
  const addComment = useAddApprovalComment();
  const deleteComment = useDeleteApprovalComment();
  const [newComment, setNewComment] = useState('');
  const { user, isAdmin } = useAuth();
  
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      await addComment.mutateAsync({
        approvalId,
        commentText: newComment
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync({
        commentId,
        approvalId
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    
    return 'UN';
  };
  
  const getAvatarColor = (str?: string): string => {
    if (!str) return 'bg-primary';
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  if (error) {
    return <div>Error loading comments: {error.message}</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea 
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none min-h-[80px]"
          />
          <div className="flex flex-col justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={addComment.isPending || !newComment.trim()}
            >
              {addComment.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No comments yet</p>
        ) : (
          <div className="space-y-4 pt-2">
            {comments.map((comment: CommissionApprovalComment) => (
              <div key={comment.id} className="relative">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getAvatarColor(comment.user?.name || comment.user?.email)}>
                      {getInitials(comment.user?.name, comment.user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {comment.user?.name || comment.user?.email || 'Unknown User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {comment.created_at ? (
                            <span title={format(new Date(comment.created_at), 'PPpp')}>
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          ) : 'Unknown time'}
                        </p>
                      </div>
                      
                      {(user?.id === comment.created_by || isAdmin) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteComment.isPending}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 text-sm">{comment.comment_text}</p>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
