
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Opportunity } from '@/types/opportunity';
import { Badge } from '@/components/ui/badge';

// Sample opportunities data
const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Looking for a family home',
    description: 'Client needs a 4-bedroom house in a good school district',
    budget: '$800,000 - $1,200,000',
    location: 'Palo Alto, CA',
    status: 'Active',
    propertyType: 'Residential',
    postedBy: 'Alex Johnson',
    postedDate: '2023-09-15'
  },
  {
    id: '2',
    title: 'Investment property opportunity',
    description: 'Investor looking for commercial retail space with existing tenants',
    budget: '$2,000,000 - $5,000,000',
    location: 'San Francisco, CA',
    status: 'Urgent',
    propertyType: 'Commercial',
    postedBy: 'Samantha Lee',
    postedDate: '2023-09-18'
  }
];

// Sample recent activity data
const recentActivity = [
  {
    id: '1',
    type: 'transaction',
    title: 'Sale completed',
    description: '123 Main Street sold for $1.2M',
    date: '2 hours ago',
    user: 'You'
  },
  {
    id: '2',
    type: 'property',
    title: 'New listing added',
    description: 'Luxury Condo in Downtown',
    date: '5 hours ago',
    user: 'Alex Johnson'
  },
  {
    id: '3',
    type: 'commission',
    title: 'Commission received',
    description: '$15,000 for 456 Oak Avenue',
    date: '1 day ago',
    user: 'You'
  }
];

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome Back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CardDescription>This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$4.2M</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <CardDescription>This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$68,500</p>
            <p className="text-sm text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-red-600">-2 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Opportunities Board</CardTitle>
              <CardDescription>
                Connect with clients and team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div 
                    key={opportunity.id} 
                    className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{opportunity.title}</h3>
                      <Badge 
                        variant={opportunity.status === 'Urgent' ? 'destructive' : 'secondary'}
                      >
                        {opportunity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                      <span>🏠 {opportunity.propertyType}</span>
                      <span>💰 {opportunity.budget}</span>
                      <span>📍 {opportunity.location}</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-muted-foreground">
                        Posted by {opportunity.postedBy} on {opportunity.postedDate}
                      </div>
                      <Button size="sm">Respond</Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center mt-2">
                  <Button variant="ghost">View All Opportunities</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 py-2">
                    <div className={`
                      w-2 h-2 rounded-full mt-2
                      ${activity.type === 'transaction' ? 'bg-green-500' : 
                        activity.type === 'property' ? 'bg-blue-500' : 'bg-amber-500'}
                    `} />
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.date} by {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-2">
                  <Button variant="ghost">View All Activity</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
