
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Sample transactions data
const transactions: Transaction[] = [
  {
    id: '1',
    propertyId: '2',
    property: {
      title: 'Suburban Family Home',
      address: {
        city: 'Palo Alto',
        state: 'CA'
      }
    },
    agentId: 'agent456',
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    buyerId: 'buyer123',
    buyer: {
      name: 'Alex Thompson'
    },
    sellerId: 'seller123',
    seller: {
      name: 'Michael Davis'
    },
    price: 750000,
    commission: 22500,
    status: 'completed',
    date: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    propertyId: '4',
    property: {
      title: 'Luxury Beach Condo',
      address: {
        city: 'Malibu',
        state: 'CA'
      }
    },
    agentId: 'agent789',
    agent: {
      name: 'Robert Wilson',
      email: 'robert@example.com'
    },
    price: 1250000,
    commission: 15000,
    status: 'pending',
    date: '2024-03-01T15:45:00Z'
  },
  {
    id: '3',
    propertyId: '5',
    property: {
      title: 'Downtown Loft',
      address: {
        city: 'San Francisco',
        state: 'CA'
      }
    },
    agentId: 'agent123',
    agent: {
      name: 'John Smith',
      email: 'john@example.com'
    },
    buyerId: 'buyer456',
    buyer: {
      name: 'Emma Williams'
    },
    sellerId: 'seller456',
    seller: {
      name: 'David Brown'
    },
    price: 950000,
    commission: 30000,
    status: 'completed',
    date: '2024-02-28T09:15:00Z'
  }
];

const Transactions = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input placeholder="Search by property, agent..." className="w-full" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filters
              </Button>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.property?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.property?.address.city}, {transaction.property?.address.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.agent?.name}
                    </TableCell>
                    <TableCell>
                      ${transaction.price?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ${transaction.commission.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.status === 'completed' ? 'success' : 'outline'}
                      >
                        {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Transactions;
