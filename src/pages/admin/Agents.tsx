
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, SortDesc, ArrowUpDown, Users, Banknote, UserPlus, UserCheck } from 'lucide-react';

const AdminAgents = () => {
  const agents = [
    { id: 1, name: 'John Doe', role: 'Senior Agent', tier: 'Tier 5', email: 'john.doe@example.com', phone: '(555) 123-4567', status: 'active', deals: 32, salesVolume: '$4.5M', commission: '$385K', avatar: '' },
    { id: 2, name: 'Jane Smith', role: 'Team Leader', tier: 'Tier 4', email: 'jane.smith@example.com', phone: '(555) 234-5678', status: 'active', deals: 28, salesVolume: '$3.2M', commission: '$264K', avatar: '' },
    { id: 3, name: 'Robert Johnson', role: 'Agent', tier: 'Tier 3', email: 'robert.johnson@example.com', phone: '(555) 345-6789', status: 'active', deals: 15, salesVolume: '$2.1M', commission: '$168K', avatar: '' },
    { id: 4, name: 'Sarah Williams', role: 'Junior Agent', tier: 'Tier 1', email: 'sarah.williams@example.com', phone: '(555) 456-7890', status: 'inactive', deals: 3, salesVolume: '$0.8M', commission: '$56K', avatar: '' },
    { id: 5, name: 'Michael Brown', role: 'Agent', tier: 'Tier 2', email: 'michael.brown@example.com', phone: '(555) 567-8901', status: 'active', deals: 10, salesVolume: '$1.5M', commission: '$112K', avatar: '' },
    { id: 6, name: 'Emily Davis', role: 'Team Leader', tier: 'Tier 4', email: 'emily.davis@example.com', phone: '(555) 678-9012', status: 'active', deals: 25, salesVolume: '$3.7M', commission: '$305K', avatar: '' },
  ];

  return (
    <AdminLayout>
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
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <SortDesc className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Commission</p>
                  <p className="text-2xl font-bold">$1.85M</p>
                </div>
                <Banknote className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">New Agents</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold">38</p>
                </div>
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="grid">
          <TabsList className="mb-6">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
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
                            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {agent.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">{agent.email}</div>
                        <div className="text-sm text-muted-foreground mb-3">{agent.phone}</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Deals</p>
                          <p className="font-medium">{agent.deals}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Volume</p>
                          <p className="font-medium">{agent.salesVolume}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Commission</p>
                          <p className="font-medium">{agent.commission}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="bg-card rounded-md border shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-1">
                          Name
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-1">
                          Role
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Phone</th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-1">
                          Deals
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-1">
                          Sales Volume
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-1">
                          Commission
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={agent.avatar} />
                              <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {agent.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {agent.role}
                            <Badge variant="outline" className="text-xs">{agent.tier}</Badge>
                          </div>
                        </td>
                        <td className="p-4">{agent.email}</td>
                        <td className="p-4">{agent.phone}</td>
                        <td className="p-4">{agent.deals}</td>
                        <td className="p-4">{agent.salesVolume}</td>
                        <td className="p-4">{agent.commission}</td>
                        <td className="p-4">
                          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                            {agent.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Link to={`/agents/${agent.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">42</span> agents
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAgents;
