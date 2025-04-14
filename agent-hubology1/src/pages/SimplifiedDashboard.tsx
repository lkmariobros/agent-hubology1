import React from 'react';
import { Building2, Trophy } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const SimplifiedDashboard: React.FC = () => {
  // Simplified metrics data
  const metrics = [
    {
      id: "commission",
      label: 'Total Commission',
      value: '$24,500',
      change: 12,
      trend: 'up',
      icon: <Building2 className="h-5 w-5 text-primary" />
    },
    {
      id: "leaderboard",
      label: 'Leaderboard Position',
      value: '#3',
      change: 2,
      trend: 'up',
      icon: <Trophy className="h-5 w-5 text-primary" />
    }
  ];
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      
      {/* Main dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md bg-card">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <div className="space-y-2">
                <p>123 Main St - $450,000</p>
                <p>456 Oak Ave - $320,000</p>
                <p>789 Pine Rd - $550,000</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Metric cards */}
        <div className="space-y-6 flex flex-col">
          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="border-none shadow-md bg-card">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      {metric.icon && (
                        <div className="rounded-full p-2 bg-primary/10 flex items-center justify-center">
                          {metric.icon}
                        </div>
                      )}
                    </div>
                    {metric.change !== undefined && metric.trend !== 'neutral' && (
                      <div className="flex items-center text-sm">
                        <span className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                          {metric.trend === 'up' ? '+' : ''}{metric.change}%
                        </span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Upcoming Payments */}
          <div className="flex-1">
            <Card className="border-none shadow-md bg-card">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
                <div className="space-y-2">
                  <p>123 Main St - $13,500 (Oct 15)</p>
                  <p>456 Oak Ave - $9,600 (Oct 22)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;
