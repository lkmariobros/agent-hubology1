
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertTriangle, Banknote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/propertyUtils';

interface SummaryCardData {
  label: string;
  value: string;
  description: string;
}

interface SummaryCardsProps {
  summaryData?: SummaryCardData[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaryData }) => {
  // If summaryData is provided, use it instead of fetching data
  if (summaryData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                  <h3 className="text-2xl font-bold">{item.value}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {index % 4 === 0 && <Clock className="h-6 w-6 text-primary" />}
                  {index % 4 === 1 && <AlertTriangle className="h-6 w-6 text-primary" />}
                  {index % 4 === 2 && <Banknote className="h-6 w-6 text-primary" />}
                  {index % 4 === 3 && <CheckCircle2 className="h-6 w-6 text-primary" />}
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {item.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Original implementation for fetching data if summaryData is not provided
  // Fetch status counts
  const { data: statusCounts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ['approval-status-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get_approval_status_counts');
      
      if (error) {
        console.error('Error fetching status counts:', error);
        throw error;
      }
      
      return data;
    }
  });
  
  // Fetch pending commission total
  const { data: pendingTotal, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pending-commission-total'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get_pending_commission_total');
      
      if (error) {
        console.error('Error fetching pending commission total:', error);
        throw error;
      }
      
      return data?.total || 0;
    }
  });
  
  // Fetch approved commission total
  const { data: approvedTotal, isLoading: isLoadingApproved } = useQuery({
    queryKey: ['approved-commission-total'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get_approved_commission_total');
      
      if (error) {
        console.error('Error fetching approved commission total:', error);
        throw error;
      }
      
      return data?.total || 0;
    }
  });
  
  // Default values for loading state
  const counts = statusCounts || {
    pending: 0,
    under_review: 0,
    approved: 0,
    ready_for_payment: 0,
    paid: 0,
    rejected: 0
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approvals</p>
              <h3 className="text-2xl font-bold">
                {isLoadingCounts ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  counts.pending
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Awaiting initial review
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Under Review</p>
              <h3 className="text-2xl font-bold">
                {isLoadingCounts ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  counts.under_review
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Being reviewed by admin
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Value</p>
              <h3 className="text-2xl font-bold">
                {isLoadingPending ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                ) : (
                  formatCurrency(pendingTotal)
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Banknote className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Total pending commission value
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Approved Value</p>
              <h3 className="text-2xl font-bold">
                {isLoadingApproved ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                ) : (
                  formatCurrency(approvedTotal)
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Ready for payment
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
