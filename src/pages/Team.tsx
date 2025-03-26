import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { User } from '@/types';

// Sample users data
const teamMembers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'agent',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    phone: '555-123-4567',
    tier: 'Senior Agent',
    properties: 24,
    transactions: 45
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    role: 'agent',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-15',
    updatedAt: '2023-02-15',
    phone: '555-234-5678',
    tier: 'Principal Agent',
    properties: 32,
    transactions: 67
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'agent',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    createdAt: '2023-03-01',
    updatedAt: '2023-03-01',
    phone: '555-345-6789',
    tier: 'Associate Agent',
    properties: 18,
    transactions: 29
  },
  {
    id: '4',
    name: 'Jessica Davis',
    email: 'jessica@example.com',
    role: 'agent',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    createdAt: '2023-04-10',
    updatedAt: '2023-04-10',
    phone: '555-456-7890',
    tier: 'Senior Agent',
    properties: 28,
    transactions: 52
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'agent',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    createdAt: '2023-05-01',
    updatedAt: '2023-05-01',
    phone: '555-567-8901',
    tier: 'Junior Agent',
    properties: 12,
    transactions: 18
  }
];

const Team = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Team</h1>
        <p className="text-muted-foreground">Meet our dedicated team of real estate professionals.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

const AgentCard = ({ agent }: { agent: User }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-3">
          {agent.avatar ? (
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-2">
              <UserCircle className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          
          <h3 className="text-lg font-medium">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">{agent.tier || agent.role}</p>
          
          <div className="w-full border-t my-2 pt-2">
            <div className="flex justify-between text-sm">
              <span>Phone:</span>
              <span className="font-medium">{agent.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Properties:</span>
              <span className="font-medium">{agent.properties || 0}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Transactions:</span>
              <span className="font-medium">{agent.transactions || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Team;
