
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone } from 'lucide-react';

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data
  const agent = {
    id,
    name: 'John Doe',
    role: 'Senior Agent',
    tier: 'Tier 5',
    avatar: '',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateJoined: 'Jan 15, 2020',
    bio: 'Experienced real estate agent with over 10 years in the industry. Specializes in luxury properties and commercial real estate.',
    salesVolume: '$4.5M',
    commission: '$385,000',
    properties: 12,
    deals: 8,
    specializations: ['Luxury Properties', 'Commercial', 'Investment'],
    areas: ['Downtown', 'Westside', 'North Hills']
  };

  return (
    <MainLayout>
      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h1 className="text-3xl font-bold">{agent.name}</h1>
                  <Badge variant="outline" className="mt-2 sm:mt-0">{agent.tier}</Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{agent.role}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.phone}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">Joined {agent.dateJoined}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sales Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{agent.salesVolume}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Commission Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{agent.commission}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{agent.properties}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{agent.bio}</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {agent.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Service Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {agent.areas.map((area) => (
                        <Badge key={area} variant="outline">{area}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Transaction history will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Agent properties will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Commission details will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AgentDetail;
