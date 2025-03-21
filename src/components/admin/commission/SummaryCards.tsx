
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle2, Banknote, PiggyBank } from 'lucide-react';

const SummaryCards = () => {
  // Fetch summary metrics
  const { data, isLoading } = useQuery({
    queryKey: ['commission-approval-metrics'],
    queryFn: async () => {
      // Get counts for each approval status
      const { data: counts, error } = await supabase
        .from('commission_approvals')
        .select('status, count(*)')
        .group('status');
      
      if (error) {
        console.error('Error fetching approval metrics:', error);
        throw error;
      }
      
      // Get sum of commission amounts for approved approvals
      const { data: approved, error: approvedError } = await supabase
        .from('commission_approvals')
        .select('commission_amount:property_transactions!inner(commission_amount)')
        .eq('status', 'Approved');
      
      if (approvedError) {
        console.error('Error fetching approved amounts:', approvedError);
        throw approvedError;
      }
      
      // Get sum of commission amounts for pending approvals
      const { data: pending, error: pendingError } = await supabase
        .from('commission_approvals')
        .select('commission_amount:property_transactions!inner(commission_amount)')
        .eq('status', 'Pending');
      
      if (pendingError) {
        console.error('Error fetching pending amounts:', pendingError);
        throw pendingError;
      }
      
      // Calculate sum of approved commission amounts
      const approvedTotal = approved.reduce((sum, item) => {
        return sum + (item.commission_amount?.commission_amount || 0);
      }, 0);
      
      // Calculate sum of pending commission amounts
      const pendingTotal = pending.reduce((sum, item) => {
        return sum + (item.commission_amount?.commission_amount || 0);
      }, 0);
      
      // Prepare status counts
      const statusCounts = {
        pending: 0,
        underReview: 0,
        approved: 0,
        readyForPayment: 0,
        paid: 0
      };
      
      counts.forEach((item: any) => {
        if (item.status === 'Pending') statusCounts.pending = item.count;
        if (item.status === 'Under Review') statusCounts.underReview = item.count;
        if (item.status === 'Approved') statusCounts.approved = item.count;
        if (item.status === 'Ready for Payment') statusCounts.readyForPayment = item.count;
        if (item.status === 'Paid') statusCounts.paid = item.count;
      });
      
      return {
        statusCounts,
        approvedTotal,
        pendingTotal
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
