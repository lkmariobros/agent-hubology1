
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Opportunity, User } from '@/types';

const Home = () => {
  // Mock data with correct types
  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Luxury Condo Buyer',
      description: 'Looking for a luxury condo in downtown area with 2+ bedrooms',
      budget: '$800,000 - $1,200,000',
      location: 'Downtown',
      status: 'Active',
      postedBy: 'John Smith',
      postedDate: '2023-06-15T10:30:00Z',
      propertyType: 'Residential'
    },
    {
      id: '2',
      title: 'Office Space Rental',
      description: 'Corporate client seeking 2000-3000 sq ft office space',
      budget: '$5,000 - $8,000/mo',
      location: 'Business District',
      status: 'Urgent',
      postedBy: 'Sarah Johnson',
      postedDate: '2023-06-18T14:45:00Z',
      propertyType: 'Commercial'
    }
  ];

  const teammates: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Team Leader',
      tier: 'Gold',
      points: 2500
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Senior Agent',
      tier: 'Silver',
      points: 1800
    }
  ];

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to Property Agency System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Opportunities</h2>
            <ul className="space-y-4">
              {opportunities.map(opp => (
                <li key={opp.id} className="border-b pb-3">
                  <h3 className="font-medium">{opp.title}</h3>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">{opp.budget}</span>
                    <span className="text-xs">{opp.location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <ul className="space-y-4">
              {teammates.map(member => (
                <li key={member.id} className="border-b pb-3">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">{member.email}</span>
                    <span className="text-xs">{member.tier}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
