import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortDesc, FileText, DollarSign, AlertCircle, CheckCircle2, Clock, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const AdminTransactions = () => {
  const transactions = [
    { 
      id: 'TRX-001', 
      property: '123 Main St, San Francisco, CA', 
      agent: 'John Doe',
      client: 'Sarah Smith',
      date: '2023-03-15', 
      amount: '$750,000', 
      commission: '$22,500',
      status: 'completed',
      type: 'sale' 
    },
    { 
      id: 'TRX-002', 
      property: '456 Oak Ave, Los Angeles, CA', 
      agent: 'Jane Smith',
      client: 'Michael Johnson',
      date: '2023-03-10', 
      amount: '$3,500', 
      commission: '$1,750',
      status: 'pending',
      type: 'rental' 
    },
    { 
      id: 'TRX-003', 
      property: '789 Pine St, San Diego, CA', 
      agent: 'Robert Johnson',
      client: 'Emily Williams',
      date: '2023-03-05', 
      amount: '$1,200,000', 
      commission: '$36,000',
      status: 'in-progress',
      type: 'sale' 
    },
    { 
      id: 'TRX-004', 
      property: '101 Cedar Blvd, San Jose, CA', 
      agent: 'Emily Davis',
      client: 'David Brown',
      date: '2023-03-01', 
      amount: '$620,000', 
      commission: '$18,600',
      status: 'completed',
      type: 'sale' 
    },
    { 
      id: 'TRX-005', 
      property: '202 Maple Rd, Oakland, CA', 
      agent: 'Michael Brown',
      client: 'Lisa Taylor',
      date: '2023-02-28', 
      amount: '$4,200', 
      commission: '$2,100',
      status: 'cancelled',
      type: 'rental' 
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'in-progress':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" />
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
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">125</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Sales Volume</p>
                <p className="text-2xl font-bold">$52.3M</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Commission Total</p>
                <p className="text-2xl font-bold">$1.57M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-card rounded-md border shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">
                  <div className="flex items-center gap-1">
                    Transaction ID
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left p-4 font-medium">Property</th>
                <th className="text-left p-4 font-medium">Agent</th>
                <th className="text-left p-4 font-medium">
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left p-4 font-medium">
                  <div className="flex items-center gap-1">
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left p-4 font-medium">Commission</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted-20">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      {transaction.id}
                    </div>
                  </td>
                  <td className="p-4">{transaction.property}</td>
                  <td className="p-4">{transaction.agent}</td>
                  <td className="p-4">{transaction.date}</td>
                  <td className="p-4">{transaction.amount}</td>
                  <td className="p-4">{transaction.commission}</td>
                  <td className="p-4">{getStatusBadge(transaction.status)}</td>
                  <td className="p-4">
                    <Badge variant="outline">
                      {transaction.type === 'sale' ? 'Sale' : 'Rental'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Link to={`/transactions/${transaction.id}`}>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">125</span> transactions
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
