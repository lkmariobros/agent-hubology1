
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Download, Plus, ArrowUpDown } from 'lucide-react';
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
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-normal tracking-tight">Transactions</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button 
            size="sm"
            className="gap-2"
            onClick={() => navigate('/transactions/new')}
          >
            <Plus size={16} />
            Add Transaction
          </Button>
        </div>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="Search by property, agent..." className="w-full h-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} />
            Filters
          </Button>
          <Button size="sm">Search</Button>
        </div>
      </Card>
      
      <Card className="overflow-hidden">
        <table className="clean-table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center">
                  Date <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th>Property</th>
              <th>Agent</th>
              <th>
                <div className="flex items-center">
                  Price <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th>
                <div className="flex items-center">
                  Commission <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr 
                key={transaction.id}
                className="cursor-pointer"
                onClick={() => navigate(`/transactions/${transaction.id}`)}
              >
                <td>
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td>
                  <div>
                    <div className="font-medium">{transaction.property?.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.property?.address.city}, {transaction.property?.address.state}
                    </div>
                  </div>
                </td>
                <td>
                  {transaction.agent?.name}
                </td>
                <td className="font-medium">
                  ${transaction.price?.toLocaleString()}
                </td>
                <td className="font-medium">
                  ${transaction.commission.toLocaleString()}
                </td>
                <td>
                  <Badge
                    variant={transaction.status === 'completed' ? 'default' : 'outline'}
                    className={transaction.status === 'pending' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : ''}
                  >
                    {transaction.status}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transactions/${transaction.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Transactions;
