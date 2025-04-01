
import React from 'react';
import CommissionForecast from '@/components/admin/commission/CommissionForecast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommissionForecastPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commission Forecast</h1>
        <p className="text-muted-foreground">
          Analyze and manage projected commission payments
        </p>
      </div>
      
      <Tabs defaultValue="forecast">
        <TabsList>
          <TabsTrigger value="forecast">Personal Forecast</TabsTrigger>
          <TabsTrigger value="team" disabled>Team Forecast</TabsTrigger>
          <TabsTrigger value="company" disabled>Company Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="pt-4">
          <CommissionForecast />
        </TabsContent>
        
        <TabsContent value="team" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Team forecast feature coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Company forecast feature coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionForecastPage;
