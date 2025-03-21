
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle2, Banknote, PiggyBank } from 'lucide-react';

// Define types for status counts and approval metrics
interface StatusCounts {
  pending: number;
  underReview: number;
  approved: number;
  readyForPayment: number;
  paid: number;
  rejected: number;
}

interface ApprovalMetrics {
  statusCounts: StatusCounts;
  approvedTotal: number;
  pendingTotal: number;
}

const SummaryCards = () => {
  // Fetch summary metrics
  const { data, isLoading } = useQuery({
    queryKey: ['commission-approval-metrics'],
    queryFn: async (): Promise<ApprovalMetrics> => {
      // Get counts for each approval status using raw SQL for now
      // This is a workaround until the Supabase types are updated with the new tables
      const { data: counts, error } = await supabase.rpc('get_approval_status_counts');
      
      if (error) {
        console.error('Error fetching approval metrics:', error);
        throw error;
      }
      
      // Get sum of commission amounts for approved approvals using RPC
      const { data: approved, error: approvedError } = await supabase.rpc('get_approved_commission_total');
      
      if (approvedError) {
        console.error('Error fetching approved amounts:', approvedError);
        throw approvedError;
      }
      
      // Get sum of commission amounts for pending approvals using RPC
      const { data: pending, error: pendingError } = await supabase.rpc('get_pending_commission_total');
      
      if (pendingError) {
        console.error('Error fetching pending amounts:', pendingError);
        throw pendingError;
      }
      
      // Prepare status counts from the response
      const statusCounts: StatusCounts = {
        pending: counts?.pending || 0,
        underReview: counts?.under_review || 0,
        approved: counts?.approved || 0,
        readyForPayment: counts?.ready_for_payment || 0,
        paid: counts?.paid || 0,
        rejected: counts?.rejected || 0
      };
      
      return {
        statusCounts,
        approvedTotal: approved?.total || 0,
        pendingTotal: pending?.total || 0
      };
    }
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isLoading ? '-' : data?.statusCounts.pending}
            </div>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? '-' : formatCurrency(data?.pendingTotal || 0)} total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isLoading ? '-' : data?.statusCounts.underReview}
            </div>
            <AlertTriangle className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Escalated for review
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isLoading ? '-' : data?.statusCounts.approved}
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? '-' : formatCurrency(data?.approvedTotal || 0)} total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ready for Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isLoading ? '-' : data?.statusCounts.readyForPayment}
            </div>
            <Banknote className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Awaiting finance processing
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isLoading ? '-' : data?.statusCounts.paid}
            </div>
            <PiggyBank className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Completed commission payments
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
