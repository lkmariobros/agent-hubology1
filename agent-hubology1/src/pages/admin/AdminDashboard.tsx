
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMetrics } from '@/hooks/useDashboard';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTransactions } from '@/hooks/useTransactions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: metricsData, isLoading: isLoadingMetrics } = useMetrics();
  const { useTransactionsQuery, useRealtimeTransactions } = useTransactions();
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactionsQuery({ 
    limit: 5, 
    page: 0 
  });
  
  // Set up real-time subscription
  useRealtimeTransactions();
  
  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest property transactions</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/transactions')}
              >
                View All
              </Button>
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
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/admin/transactions/${transaction.id}`)}>
                      <div>
                        <p className="font-medium">{transaction.property?.title || 'Unnamed Property'}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{formatDate(transaction.transaction_date)}</span>
                          <span>•</span>
                          <span>{transaction.agent?.full_name || 'Unknown Agent'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">${transaction.transaction_value?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Commission: ${transaction.commission_amount?.toLocaleString()}</p>
                        </div>
                        <Badge variant={
                          transaction.status === 'Completed' ? 'default' : 
                          transaction.status === 'Pending' ? 'secondary' : 
                          transaction.status === 'Cancelled' ? 'destructive' : 'outline'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/admin/transactions')}
                  >
                    View All Transactions
                  </Button>
                </div>
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
