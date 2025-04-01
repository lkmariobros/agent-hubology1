
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import { useAuth } from '@/hooks/useAuth';
import ApprovalWorkflow from '@/components/commission/ApprovalWorkflow';
import ApprovalActions from '@/components/commission/ApprovalActions';
import ApprovalHistory from '@/components/commission/ApprovalHistory';
import ApprovalStatus from '@/components/commission/ApprovalStatus';
import ApprovalComments from './ApprovalComments';

interface ApprovalDetailProps {
  id: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  
  const { 
    useCommissionApprovalDetail, 
    useUpdateApprovalStatusMutation,
    useApprovalComments,
    useAddApprovalCommentMutation,
    useDeleteApprovalCommentMutation
  } = useCommissionApproval;
  
  // Fetch approval data
  const { data, isLoading, error } = useCommissionApprovalDetail(id);
  const approval = data?.approval;
  const history = data?.history || [];
  
  // Fetch comments
  const { 
    data: comments = [], 
    isLoading: isLoadingComments 
  } = useApprovalComments(id);
  
  // Mutations
  const updateApprovalStatus = useUpdateApprovalStatusMutation();
  const addComment = useAddApprovalCommentMutation();
  const deleteComment = useDeleteApprovalCommentMutation();
  
  const handleUpdateStatus = async (newStatus: string, notes?: string) => {
    setIsUpdateLoading(true);
    try {
      await updateApprovalStatus.mutateAsync({ approvalId: id, newStatus, notes });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdateLoading(false);
    }
  };
  
  const handleAddComment = async (comment: string) => {
    await addComment.mutateAsync({ approvalId: id, comment });
  };
  
  const handleDeleteComment = async (commentId: string) => {
    await deleteComment.mutateAsync({ commentId, approvalId: id });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !approval) {
    return (
      <div className="py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-lg text-red-500">Error loading approval details</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Approvals
          </Button>
          <h1 className="text-2xl font-bold">Commission Approval Details</h1>
          <p className="text-muted-foreground">
            Review and manage commission approval for transaction #{approval.transaction_id}
          </p>
        </div>
        <ApprovalStatus status={approval.status} size="lg" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Transaction Date</p>
                <p>{new Date(approval.transaction.transaction_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Transaction Value</p>
                <p className="font-medium">{formatCurrency(approval.transaction.transaction_value)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Commission Rate</p>
                <p>{approval.transaction.commission_rate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Commission Amount</p>
                <p className="font-bold">{formatCurrency(approval.transaction.commission_amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Submitted By</p>
                <p>{approval.submitted_by || 'System'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Creation Date</p>
                <p>{new Date(approval.created_at).toLocaleDateString()}</p>
              </div>
              {approval.threshold_exceeded && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-amber-600">
                    This commission exceeds the approval threshold and requires review.
                  </p>
                </div>
              )}
              {approval.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm">{approval.notes}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <ApprovalActions 
                currentStatus={approval.status} 
                onUpdateStatus={handleUpdateStatus}
                isLoading={isUpdateLoading}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="row-span-2">
          <CardHeader>
            <CardTitle>Approval Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalWorkflow currentStatus={approval.status} />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="m-0">
              {approval.transaction.installments_generated ? (
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Installments</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">#</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Percentage</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(approval.installments) && approval.installments.length > 0) ? (
                        approval.installments.map((installment: any) => (
                          <tr key={installment.id} className="border-b">
                            <td className="py-2">{installment.installment_number}</td>
                            <td className="py-2">{formatCurrency(installment.amount)}</td>
                            <td className="py-2">{installment.percentage}%</td>
                            <td className="py-2">
                              {new Date(installment.scheduled_date).toLocaleDateString()}
                            </td>
                            <td className="py-2">{installment.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted-foreground">
                            Installment data is loading or not available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">
                    Payment installments will be generated once this commission is approved.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              <ApprovalHistory history={history} />
            </TabsContent>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ApprovalComments 
            approvalId={id}
            comments={comments}
            isLoading={isLoadingComments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetail;
