
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Sample data for the leaderboard
const agentData = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    sales: 12500000, 
    transactions: 18, 
    rank: 'Senior Agent',
    avatar: '/avatars/sarah.jpg'
  },
  { 
    id: 2, 
    name: 'Michael Brown', 
    sales: 10750000, 
    transactions: 15, 
    rank: 'Agent',
    avatar: '/avatars/michael.jpg'
  },
  { 
    id: 3, 
    name: 'John Smith', 
    sales: 9200000, 
    transactions: 14, 
    rank: 'Senior Agent',
    avatar: '/avatars/john.jpg'
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    sales: 8100000, 
    transactions: 12, 
    rank: 'Agent',
    avatar: '/avatars/emily.jpg'
  },
  { 
    id: 5, 
    name: 'David Wilson', 
    sales: 7500000, 
    transactions: 10, 
    rank: 'Junior Agent',
    avatar: '/avatars/david.jpg'
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const Leaderboard = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
      </div>
      
      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sales">Sales Volume</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers by Sales Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {agentData.sort((a, b) => b.sales - a.sales).map((agent, index) => (
                  <div key={agent.id} className="flex items-center">
                    <div className="flex-shrink-0 mr-4 w-8 text-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {agent.rank}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(agent.sales)}</p>
                          <p className="text-sm text-muted-foreground">{agent.transactions} transactions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers by Transaction Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {agentData.sort((a, b) => b.transactions - a.transactions).map((agent, index) => (
                  <div key={agent.id} className="flex items-center">
                    <div className="flex-shrink-0 mr-4 w-8 text-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {agent.rank}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{agent.transactions} transactions</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(agent.sales)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
