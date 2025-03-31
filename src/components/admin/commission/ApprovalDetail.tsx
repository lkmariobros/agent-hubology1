
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import useCommissionSchedules from '@/hooks/useCommissionSchedules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Clock, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ApprovalStatusUpdater from './ApprovalStatusUpdater';
import ApprovalComments from './ApprovalComments';
import ApprovalHistory from './ApprovalHistory';
import PaymentScheduleCard from '@/components/commission/schedules/PaymentScheduleCard';
import PaymentScheduleGenerator from './PaymentScheduleGenerator';

interface ApprovalDetailProps {
  id: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ id }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('details');
  
  const { useCommissionApprovalDetail } = useCommissionApproval;
  const { data: approvalData, isLoading, error } = useCommissionApprovalDetail(id);
  
  const { useApprovalPaymentSchedule } = useCommissionSchedules();
  const { data: paymentSchedule, isLoading: scheduleLoading } = useApprovalPaymentSchedule(id);
  
  const approval = approvalData?.approval;
  const history = approvalData?.history || [];
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return 'Not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Pending':
      case 'Under Review':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'Ready for Payment':
      case 'Paid':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4"
            onClick={() => navigate('/admin/commission-approval')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-80" />
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !approval) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/commission-approval')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Approval Not Found</h3>
              <p className="text-muted-foreground">
                The approval you're looking for could not be found or you don't have permission to view it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const transactionDetails = approval.property_transactions || {};
  const hasSchedule = !!paymentSchedule || !!approval.payment_schedule_id;
  const showScheduleGenerator = approval.status === 'Approved' && !hasSchedule;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4"
            onClick={() => navigate('/admin/commission-approval')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            {getStatusIcon(approval.status)}
            <span className="ml-2">
              Commission Approval - {formatCurrency(transactionDetails.commission_amount)}
            </span>
          </h1>
        </div>
        
        <ApprovalStatusUpdater approval={approval} />
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Transaction Value</h3>
                  <p className="text-lg font-semibold">
                    {formatCurrency(transactionDetails.transaction_value)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Commission Amount</h3>
                  <p className="text-lg font-semibold">
                    {formatCurrency(transactionDetails.commission_amount)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Commission Rate</h3>
                  <p className="text-lg font-semibold">
                    {transactionDetails.commission_rate}%
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Transaction Date</h3>
                  <p className="text-lg font-semibold">
                    {formatDate(transactionDetails.transaction_date)}
                  </p>
                </div>
              </div>
              
              {transactionDetails.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p>{transactionDetails.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Approval Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-lg font-semibold flex items-center">
                    {getStatusIcon(approval.status)}
                    <span className="ml-2">{approval.status}</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p className="text-lg font-semibold">
                    {formatDate(approval.created_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="text-lg font-semibold">
                    {formatDate(approval.updated_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Threshold Exceeded</h3>
                  <p className="text-lg font-semibold">
                    {approval.threshold_exceeded ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              {approval.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p>{approval.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          {scheduleLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : hasSchedule ? (
            <PaymentScheduleCard schedule={paymentSchedule} />
          ) : showScheduleGenerator ? (
            <PaymentScheduleGenerator approvalId={id} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Payment Schedule</h3>
                  <p className="text-muted-foreground mb-6">
                    This commission doesn't have a payment schedule yet. The approval status must be "Approved" to create a payment schedule.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <ApprovalHistory approvalId={id} history={history} />
        </TabsContent>
        
        <TabsContent value="comments">
          <ApprovalComments approvalId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalDetail;
