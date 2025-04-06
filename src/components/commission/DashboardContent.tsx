
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommissionBreakdown from './CommissionBreakdown';
import CommissionTiers from './CommissionTiers';
import { Progress } from "@/components/ui/progress";

interface DashboardContentProps {
  commissionTiers: any[];
  commissions: any[];
  agentHierarchy: any;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  commissionTiers, 
  commissions,
  agentHierarchy
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format currency
  const formatCurrency = (amount?: number): string => {
    if (amount === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="schedules">Payment Schedules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission History</CardTitle>
                </CardHeader>
                <CardContent>
                  {commissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-3 mb-2 hover:bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-medium">$</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{commission.property.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(commission.date).toLocaleDateString()} • {commission.property.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <p className="text-sm font-medium">{formatCurrency(commission.amount)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            commission.type === 'override' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {commission.type === 'override' ? 'Override' : 'Personal'}
                            {commission.source && ` • ${commission.source}`}
                          </span>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-4 py-2 border rounded-md text-sm hover:bg-muted">
                    View All Commissions
                  </button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">Personal Sales Commission</span>
                      <span className="text-xl font-bold">{formatCurrency(agentHierarchy.personalCommission)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">Override Commission</span>
                      <span className="text-xl font-bold">{formatCurrency(agentHierarchy.overrideCommission)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-medium">Total Commission (YTD)</span>
                      <span className="text-2xl font-bold">{formatCurrency(agentHierarchy.totalCommission)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Commission Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-medium">Current Tier</p>
                          <h3 className="text-2xl font-bold">Silver</h3>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full">
                          <div className="text-center">
                            <span className="text-2xl font-bold">25%</span>
                            <p className="text-xs text-muted-foreground">Rate</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Progress to next tier</p>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forecast" className="pt-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Forecast content will be displayed here</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedules" className="pt-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Payment schedules content will be displayed here</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Notifications will be displayed here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
