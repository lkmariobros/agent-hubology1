
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMetrics } from '@/hooks/useDashboard';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const { data: metricsData, isLoading: isLoadingMetrics } = useMetrics();
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your agency's performance and operations.</p>
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
              <p className="text-muted-foreground">Transaction data coming soon</p>
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
