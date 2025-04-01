
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CalendarClock, FileText, User, DollarSign, Clock, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '../commission/StatusBadge';
import ApprovalWorkflow from './ApprovalWorkflow';
import ApprovalHistory from '@/components/commission/ApprovalHistory';
import ApprovalActions from '@/components/commission/ApprovalActions';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import { formatCurrency, formatDate } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

// Update the CommissionApproval interface to include the necessary properties
interface ExtendedTransaction {
  commission_amount: number;
  transaction_date: string;
  property?: {
    title?: string;
  };
  transaction_value?: number;
}

interface ApprovalDetailProps {
  id: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    useCommissionApprovalDetail,
    useUpdateApprovalStatusMutation
  } = useCommissionApproval;
  
  const { 
    data, 
    isLoading: isLoadingDetail, 
    isError 
  } = useCommissionApprovalDetail(id);
  
  const updateStatusMutation = useUpdateApprovalStatusMutation();
  
  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        approvalId: id,
        newStatus,
        notes
      });
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };
  
  if (isLoadingDetail) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading commission approval details...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !data?.approval) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Commission Approval Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested approval information could not be found.</p>
        <Button onClick={() => navigate('/admin/commission/approval')}>
          Go Back to Approvals
        </Button>
      </div>
    );
  }
  
  const { approval, history } = data;

  // Type assertion to ensure our transaction has the expected properties
  const transaction = approval.transaction as ExtendedTransaction;
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/commission/approval')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Approvals
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h2 className="text-2xl font-semibold">Commission Approval Details</h2>
        </div>
        <StatusBadge status={approval.status} size="lg" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <ApprovalWorkflow currentStatus={approval.status} />
              
              <Separator className="my-6" />
              
              <ApprovalActions 
                currentStatus={approval.status}
                onUpdateStatus={handleStatusUpdate}
                isLoading={updateStatusMutation.isPending}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transaction">Transaction</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Commission Amount</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(transaction?.commission_amount || 0)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={approval.status} />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Submitted By</span>
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {approval.submitted_by || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Submission Date</span>
                    <span className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      {approval.created_at ? format(parseISO(approval.created_at), 'MMM d, yyyy') : 'Not specified'}
                    </span>
                  </div>
                  
                  {approval.reviewed_at && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Reviewed Date</span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(parseISO(approval.reviewed_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                
                {approval.notes && (
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="text-sm">{approval.notes}</p>
                    </div>
                  </div>
                )}
                
                {approval.threshold_exceeded && (
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mt-4">
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Threshold Exceeded</p>
                        <p className="text-sm text-amber-700 mt-1">
                          This commission exceeded the automatic approval threshold and requires manual review.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="transaction" className="space-y-4 pt-4">
                {transaction ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Transaction ID</span>
                        <span className="font-mono">{approval.transaction_id}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Transaction Date</span>
                        <span>
                          {transaction.transaction_date 
                            ? format(parseISO(transaction.transaction_date), 'MMM d, yyyy')
                            : 'Not specified'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Property</span>
                        <span>{transaction.property?.title || 'Not specified'}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Transaction Value</span>
                        <span className="font-semibold">
                          {formatCurrency(transaction.transaction_value || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 gap-2"
                      onClick={() => navigate(`/transactions/${approval.transaction_id}`)}
                    >
                      <FileText className="h-4 w-4" />
                      View Full Transaction Details
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">Transaction details not available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="pt-4">
                <ApprovalHistory history={history || []} />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Sidebar content with additional details could go here */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => navigate(`/transactions/${approval.transaction_id}`)}
              >
                <FileText className="h-4 w-4" />
                View Transaction
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => navigate('/admin/commission/approval')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Approvals
              </Button>
            </CardContent>
          </Card>
          
          {/* Additional sidebar cards could be added here */}
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetail;
