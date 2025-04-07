
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMetrics } from '@/hooks/useDashboard';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTransactions } from '@/hooks/useTransactions';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

const AdminDashboard = () => {
  const { data: metricsData, isLoading: isLoadingMetrics } = useMetrics();
  const { useTransactionsQuery } = useTransactions();
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactionsQuery({ 
    limit: 5, 
    page: 0 
  });
  const queryClient = useQueryClient();
  
  // Set up real-time subscription to transaction changes
  useEffect(() => {
    // Subscribe to changes in property_transactions table
    const channel = supabase
      .channel('admin-dashboard-transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'property_transactions' },
        () => {
          // Invalidate and refetch transactions data when changes happen
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your agency's performance and operations.</p>
        </div>
        <SidebarTrigger className="md:hidden" />
      </div>
      
      {isLoadingMetrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[160px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <MetricsContainer metrics={metricsData?.data.metrics || []} />
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by property type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded">
                  <p className="text-muted-foreground">Chart coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Top performing agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded">
                  <p className="text-muted-foreground">Chart coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Tracking key metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded">
                <p className="text-muted-foreground">Chart coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest property transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded" />
                  ))}
                </div>
              ) : transactionsData?.transactions?.length ? (
                <div className="space-y-4">
                  {transactionsData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{transaction.property?.title || 'Unnamed Property'}</p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.transaction_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">${transaction.transaction_value?.toLocaleString()}</p>
                        <Badge variant={
                          transaction.status === 'Completed' ? 'success' : 
                          transaction.status === 'Pending' ? 'warning' : 
                          transaction.status === 'Cancelled' ? 'destructive' : 'outline'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No transactions found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Distribution</CardTitle>
              <CardDescription>Agents by tier and specialization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Agent data coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Approvals</CardTitle>
              <CardDescription>Pending approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Approval data coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
