import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '@/types';

const Team = () => {
  const teamMembers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      role: 'Team Leader',
      tier: 'Gold',
      avatar: '/avatars/avatar-1.png',
      properties: 12,
      transactions: 45,
      joinDate: '2021-03-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-5678',
      role: 'Senior Agent',
      tier: 'Silver',
      avatar: '/avatars/avatar-2.png',
      properties: 8,
      transactions: 32,
      joinDate: '2021-03-15'
    },
    {
      id: '3',
      name: 'Robert Jones',
      email: 'robert@example.com',
      phone: '555-9012',
      role: 'Agent',
      tier: 'Bronze',
      avatar: '/avatars/avatar-3.png',
      properties: 5,
      transactions: 20,
      joinDate: '2021-03-15'
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily@example.com',
      phone: '555-3456',
      role: 'Agent',
      tier: 'Bronze',
      avatar: '/avatars/avatar-4.png',
      properties: 3,
      transactions: 15,
      joinDate: '2021-03-15'
    },
    {
      id: '5',
      name: 'Michael Davis',
      email: 'michael@example.com',
      phone: '555-7890',
      role: 'Agent',
      tier: 'Bronze',
      avatar: '/avatars/avatar-5.png',
      properties: 2,
      transactions: 10,
      joinDate: '2021-03-15'
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{member.name}</h2>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Properties:</span> {member.properties}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Transactions:</span> {member.transactions}
                </p>
                <Badge variant="secondary">{member.tier} Tier</Badge>
              </div>
              <div className="mt-4">
                <Link to={`/team/${member.id}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
