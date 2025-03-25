
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Banknote,
  MessageSquare,
  History,
  DollarSign,
  Building,
  User
} from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';
import { useCommissionApprovalDetail, useUpdateApprovalStatus, useAddApprovalComment } from '@/hooks/useCommissionApproval';

interface ApprovalDetailProps {
  id: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [notes, setNotes] = useState('');
  
  const { 
    data, 
    isLoading,
    error 
  } = useCommissionApprovalDetail(id, true);
  
  const updateStatusMutation = useUpdateApprovalStatus();
  const addCommentMutation = useAddApprovalComment();
  
  const handleUpdateStatus = async (status: string) => {
    if (window.confirm(`Are you sure you want to mark this approval as ${status}?`)) {
      await updateStatusMutation.mutateAsync({
        approvalId: id,
        status,
        notes
      });
    }
  };
  
  const handleAddComment = async () => {
    if (commentText.trim()) {
      await addCommentMutation.mutateAsync({
        approvalId: id,
        content: commentText
      });
      setCommentText('');
    }
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
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/commission/approvals')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </div>
        
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="h-24 w-full bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/commission/approvals')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Button>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-medium mb-4">
                Error loading approval details
              </p>
              <p className="text-muted-foreground mb-6">
                The requested approval could not be found or you may not have permission to view it.
              </p>
              <Button onClick={() => navigate('/admin/commission/approvals')}>
                Return to Approvals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const { approval, history, comments } = data;
  const transaction = approval.property_transactions;
  
  // Determine available actions based on current status
  const getAvailableActions = () => {
    switch(approval.status) {
      case 'Pending':
        return (
          <>
            <Button 
              className="flex-1" 
              variant="outline" 
              onClick={() => handleUpdateStatus('Under Review')}
              disabled={updateStatusMutation.isPending}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Mark as Under Review
            </Button>
            <Button 
              className="flex-1" 
              variant="default" 
              onClick={() => handleUpdateStatus('Approved')}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button 
              className="flex-1" 
              variant="destructive" 
              onClick={() => handleUpdateStatus('Rejected')}
              disabled={updateStatusMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </>
        );
      case 'Under Review':
        return (
          <>
            <Button 
              className="flex-1" 
              variant="default" 
              onClick={() => handleUpdateStatus('Approved')}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button 
              className="flex-1" 
              variant="destructive" 
              onClick={() => handleUpdateStatus('Rejected')}
              disabled={updateStatusMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </>
        );
      case 'Approved':
        return (
          <Button 
            className="flex-1" 
            variant="default" 
            onClick={() => handleUpdateStatus('Ready for Payment')}
            disabled={updateStatusMutation.isPending}
          >
            <Banknote className="h-4 w-4 mr-2" />
            Mark Ready for Payment
          </Button>
        );
      case 'Ready for Payment':
        return (
          <Button 
            className="flex-1" 
            variant="default" 
            onClick={() => handleUpdateStatus('Paid')}
            disabled={updateStatusMutation.isPending}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        );
      case 'Paid':
        return (
          <div className="text-center text-sm text-muted-foreground py-2">
            This commission has been marked as paid and no further actions are available.
          </div>
        );
      case 'Rejected':
        return (
          <div className="text-center text-sm text-muted-foreground py-2">
            This commission has been rejected. No further actions are available.
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/commission/approvals')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Commission Approval</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(approval.status)}`}>
            {getStatusIcon(approval.status)}
            <span className="ml-1">{approval.status}</span>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Details</CardTitle>
              <CardDescription>
                Submitted on {formatDate(approval.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Transaction Details</TabsTrigger>
                  <TabsTrigger value="history">Approval History</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                      Commission Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <span>{approval.transaction_id}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Commission Amount:</span>
                          <span className="font-medium">{formatCurrency(transaction.commission_amount)}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Transaction Value:</span>
                          <span>{formatCurrency(transaction.transaction_value)}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Commission Rate:</span>
                          <span>{transaction.commission_rate}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Transaction Date:</span>
                          <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">High Value:</span>
                          <span>{approval.threshold_exceeded ? 
                            <span className="text-amber-600 font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" /> Yes
                            </span> : 
                            'No'
                          }</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Submitted By:</span>
                          <span>{approval.submitted_by}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Reviewed By:</span>
                          <span>{approval.reviewed_by || 'Not yet reviewed'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                      Property Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Property ID:</span>
                          <span>{transaction.property_id || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-muted-foreground" />
                      Agent Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Agent ID:</span>
                          <span>{transaction.agent_id || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {transaction.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Transaction Notes</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {transaction.notes}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {approval.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Approval Notes</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {approval.notes}
                        </p>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <History className="h-5 w-5 mr-2 text-muted-foreground" />
                      Approval History
                    </h3>
                    
                    {history.length === 0 ? (
                      <p className="text-muted-foreground py-4">No history records found.</p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((record) => (
                          <div key={record.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.new_status)}`}>
                                  {getStatusIcon(record.new_status)}
                                  <span className="ml-1">{record.new_status}</span>
                                </span>
                                <span className="mx-2 text-muted-foreground">from</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.previous_status)}`}>
                                  {getStatusIcon(record.previous_status)}
                                  <span className="ml-1">{record.previous_status}</span>
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(record.created_at)}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground">Changed by:</span>
                              <span className="ml-2">{record.changed_by}</span>
                            </div>
                            
                            {record.notes && (
                              <div className="mt-2 text-sm whitespace-pre-line">
                                <span className="text-muted-foreground">Notes:</span>
                                <p className="mt-1 pl-4 border-l-2 border-muted">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="comments" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                      Comments
                    </h3>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                      {comments.length === 0 ? (
                        <p className="text-muted-foreground py-4">No comments yet.</p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{comment.created_by}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="whitespace-pre-line">{comment.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[100px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button 
                        onClick={handleAddComment} 
                        disabled={!commentText.trim() || addCommentMutation.isPending}
                        className="w-full"
                      >
                        {addCommentMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                            Adding Comment...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Actions</CardTitle>
              <CardDescription>
                Update the approval status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getAvailableActions()}
                </div>
                
                {['Pending', 'Under Review'].includes(approval.status) && (
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">
                      Notes (will be visible in history)
                    </label>
                    <Textarea
                      placeholder="Add notes about this decision..."
                      className="min-h-[100px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-6 pb-6 border-l-2 border-muted">
                  <div className="absolute top-0 left-[-8px] h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="font-medium">Submitted</div>
                  <div className="text-sm text-muted-foreground">{formatDate(approval.created_at)}</div>
                </div>
                
                {history.map((record, index) => (
                  <div key={index} className="relative pl-6 pb-6 border-l-2 border-muted">
                    <div className={`absolute top-0 left-[-8px] h-4 w-4 rounded-full ${
                      record.new_status === 'Rejected' ? 'bg-red-500' : 
                      record.new_status === 'Approved' ? 'bg-green-500' :
                      record.new_status === 'Ready for Payment' ? 'bg-purple-500' :
                      record.new_status === 'Paid' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></div>
                    <div className="font-medium">{record.new_status}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(record.created_at)}</div>
                  </div>
                ))}
                
                {history.length === 0 && (
                  <div className="relative pl-6 pb-6 border-l-2 border-dashed border-muted">
                    <div className="absolute top-0 left-[-8px] h-4 w-4 rounded-full bg-muted"></div>
                    <div className="font-medium text-muted-foreground">Awaiting Next Step</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetail;
