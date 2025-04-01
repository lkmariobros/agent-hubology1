
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommissionBreakdown from './CommissionBreakdown';
import CommissionHistory from './CommissionHistory';
import CommissionTiers from './CommissionTiers';
import CommissionForecastChart from './CommissionForecastChart';
import CommissionNotificationFeed from './CommissionNotificationFeed';
import PaymentScheduleDetail from './PaymentScheduleDetail';
import useAuth from '@/hooks/useAuth';
import { useForecastCalculation } from '@/hooks/useForecastCalculation';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';
import { AgentWithHierarchy, CommissionHistory as CommissionHistoryType, CommissionTier } from '@/types';

interface DashboardContentProps {
  commissionTiers: CommissionTier[];
  commissions: CommissionHistoryType[];
  agentHierarchy: AgentWithHierarchy;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  commissionTiers, 
  commissions,
  agentHierarchy
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { forecastSummary, generateForecast, isLoadingSummary } = useForecastCalculation(user?.id);
  const { paymentSchedules } = usePaymentSchedules();
  
  // Get the default payment schedule for visualization
  const defaultSchedule = paymentSchedules?.find(schedule => schedule.isDefault);
  
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
                  <CommissionHistory commissions={commissions} />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <CommissionBreakdown 
                personalCommission={agentHierarchy.personalCommission} 
                overrideCommission={agentHierarchy.overrideCommission} 
                totalCommission={agentHierarchy.totalCommission} 
              />
              
              <CommissionTiers 
                tiers={commissionTiers} 
                currentTier="Silver" 
                salesVolume={agentHierarchy.salesVolume} 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forecast" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CommissionForecastChart forecastData={forecastSummary} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Forecast Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastSummary.slice(0, 6).map((month, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <span>{month.month}</span>
                      <span className="font-medium">{formatCurrency(month.total_amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedules" className="pt-4">
          {defaultSchedule && (
            <PaymentScheduleDetail 
              schedule={defaultSchedule} 
              commissionAmount={10000} // Example commission amount
            />
          )}
          
          {!defaultSchedule && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No payment schedules available</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-4">
          <CommissionNotificationFeed limit={10} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for formatting currency
const formatCurrency = (amount?: number): string => {
  if (amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export default DashboardContent;
