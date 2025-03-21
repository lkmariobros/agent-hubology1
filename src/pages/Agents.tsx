
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Agents = () => {
  const agentsList = [
    { id: 1, name: 'John Doe', role: 'Senior Agent', tier: 'Tier 5', sales: '$4.5M', properties: 12, avatar: '' },
    { id: 2, name: 'Jane Smith', role: 'Team Leader', tier: 'Tier 4', sales: '$3.2M', properties: 8, avatar: '' },
    { id: 3, name: 'Robert Johnson', role: 'Agent', tier: 'Tier 3', sales: '$2.1M', properties: 5, avatar: '' },
    { id: 4, name: 'Sarah Williams', role: 'Junior Agent', tier: 'Tier 1', sales: '$0.8M', properties: 3, avatar: '' },
    { id: 5, name: 'Michael Brown', role: 'Agent', tier: 'Tier 2', sales: '$1.5M', properties: 6, avatar: '' },
    { id: 6, name: 'Emily Davis', role: 'Team Leader', tier: 'Tier 4', sales: '$3.7M', properties: 10, avatar: '' },
  ];

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold">Agents</h1>
          <Link to="/agents/new">
            <Button className="mt-3 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add New Agent
            </Button>
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search agents..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Sort</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentsList.map((agent) => (
            <Link to={`/agents/${agent.id}`} key={agent.id}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.avatar} />
                      <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{agent.role}</span>
                        <Badge variant="outline" className="text-xs">{agent.tier}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Sales Volume</p>
                      <p className="font-medium">{agent.sales}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Properties</p>
                      <p className="font-medium">{agent.properties}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Agents;
