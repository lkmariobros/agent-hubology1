
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

const Team = () => {
  // Sample team data
  const teammates: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Team Leader',
      tier: 'Gold',
      joinDate: '2023-01-15',
      transactions: 24,
      points: 2500
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Senior Agent',
      tier: 'Silver',
      joinDate: '2023-02-20',
      transactions: 18,
      points: 1800
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Agent',
      tier: 'Bronze',
      joinDate: '2023-03-10',
      transactions: 12,
      points: 1200
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      role: 'Junior Agent',
      tier: 'Bronze',
      joinDate: '2023-04-05',
      transactions: 8,
      points: 800
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'Agent',
      tier: 'Silver',
      joinDate: '2023-05-15',
      transactions: 15,
      points: 1500
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Team</h1>
      
      <Tabs defaultValue="members">
        <TabsList className="mb-6">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="structure">Team Structure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teammates.map(member => (
              <Card key={member.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">{member.role}</span>
                </CardHeader>
                <CardContent>
                  <p className="mb-2"><span className="font-semibold">Email:</span> {member.email}</p>
                  <p className="mb-2"><span className="font-semibold">Joined:</span> {member.joinDate}</p>
                  <div className="flex justify-between mt-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Transactions</span>
                      <p className="font-semibold">{member.transactions}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Tier</span>
                      <p className="font-semibold">{member.tier}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="structure">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Team structure visualization coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;
