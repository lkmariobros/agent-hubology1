
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarRange, Briefcase, ListFilter, LineChart, Building, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCommission from '@/components/dashboard/DashboardCommission';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Sample metrics for demonstration with required icon property
  const metrics = [
    {
      label: "Transactions",
      value: "12",
      change: 8.2,
      trend: "up" as const,
      description: "This month's transactions",
      icon: <Receipt className="h-5 w-5 text-blue-500" />
    },
    {
      label: "Listings",
      value: "32",
      change: -3.1,
      trend: "down" as const,
      description: "Active property listings",
      icon: <Building className="h-5 w-5 text-orange-500" />
    },
    {
      label: "Client Inquiries",
      value: "47",
      change: 12.5,
      trend: "up" as const,
      description: "New inquiries this month",
      icon: <LineChart className="h-5 w-5 text-green-500" />
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCommission />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-md">
                <CalendarRange className="h-4 w-4 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transactions">
                <TabsList className="mb-4">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                  <RecentTransactions limit={5} />
                </TabsContent>
                <TabsContent value="properties">
                  <PropertyShowcase />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-md">
                <Briefcase className="h-4 w-4 mr-2" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OpportunitiesBoard onViewAll={() => navigate('/opportunities')} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-md">
                <ListFilter className="h-4 w-4 mr-2" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
