
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommissionHeader from '@/components/commission/CommissionHeader';
import { CommissionMetrics } from '@/components/commission/CommissionMetrics';
import { CommissionHistory } from '@/components/commission/CommissionHistory';
import { DashboardContent } from '@/components/commission/DashboardContent';
import { TeamContent } from '@/components/commission/TeamContent';
import { useAuth } from '@/hooks/useAuth';

const Commission = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <CommissionHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <CommissionMetrics />
          <DashboardContent />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <CommissionHistory limit={20} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <TeamContent />
        </TabsContent>
        
        <TabsContent value="forecast">
          {/* Import and use the CommissionForecast component */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Forecast</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <iframe 
                src="/commission-forecast" 
                className="w-full h-[600px] border-0" 
                title="Commission Forecast"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commission;
