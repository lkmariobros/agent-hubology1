
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import CommissionTiers from '@/components/commission/CommissionTiers';
import { CommissionTier } from '@/types';

// Sample commission data
const currentMonth = {
  earned: 12750,
  target: 20000,
  progress: 63.75
};

const previousMonth = {
  earned: 18900,
  target: 20000,
  progress: 94.5
};

const yearToDate = {
  earned: 89500,
  target: 150000,
  progress: 59.67
};

// Sample commission tiers
const commissionTiers: CommissionTier[] = [
  {
    tier: 'Bronze',
    rate: 20,
    minTransactions: 0,
    color: 'blue'
  },
  {
    tier: 'Silver',
    rate: 25,
    minTransactions: 10,
    color: 'purple'
  },
  {
    tier: 'Gold',
    rate: 30,
    minTransactions: 25,
    color: 'pink'
  },
  {
    tier: 'Platinum',
    rate: 35,
    minTransactions: 50,
    color: 'orange'
  },
  {
    tier: 'Diamond',
    rate: 40,
    minTransactions: 100,
    color: 'green'
  }
];

// Sample recent commission history
const recentCommissions = [
  {
    id: '1',
    propertyTitle: 'Suburban Family Home',
    location: 'Palo Alto, CA',
    date: '2024-02-15',
    amount: 22500
  },
  {
    id: '2',
    propertyTitle: 'Downtown Loft',
    location: 'San Francisco, CA',
    date: '2024-02-28',
    amount: 30000
  },
  {
    id: '3',
    propertyTitle: 'Beachside Condo',
    location: 'Santa Monica, CA',
    date: '2024-01-20',
    amount: 18750
  },
  {
    id: '4',
    propertyTitle: 'Modern Townhouse',
    location: 'Berkeley, CA',
    date: '2024-01-05',
    amount: 15000
  }
];

const Commission = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commission</h1>
          <p className="text-muted-foreground">
            Track your commission earnings and progress towards your targets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">${currentMonth.earned.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">/ ${currentMonth.target.toLocaleString()}</span>
              </div>
              <Progress 
                value={currentMonth.progress} 
                className="h-2 mt-4" 
                indicatorClassName="bg-property-blue"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {currentMonth.progress}% of monthly target
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Previous Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">${previousMonth.earned.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">/ ${previousMonth.target.toLocaleString()}</span>
              </div>
              <Progress 
                value={previousMonth.progress} 
                className="h-2 mt-4" 
                indicatorClassName="bg-property-purple"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {previousMonth.progress}% of monthly target
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">${yearToDate.earned.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">/ ${yearToDate.target.toLocaleString()}</span>
              </div>
              <Progress 
                value={yearToDate.progress} 
                className="h-2 mt-4" 
                indicatorClassName="bg-property-pink"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {yearToDate.progress}% of yearly target
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Recent History</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {recentCommissions.map(commission => (
                        <div key={commission.id} className="flex justify-between p-4">
                          <div>
                            <p className="font-medium">{commission.propertyTitle}</p>
                            <p className="text-sm text-muted-foreground">{commission.location}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(commission.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${commission.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="forecast" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Commission forecast will be available soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <CommissionTiers 
              tiers={commissionTiers} 
              currentTier="Silver" 
              transactionsCompleted={15}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Commission;
