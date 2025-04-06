
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ArrowUpDown, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Sample transaction data
const transactionsData = [
  {
    id: "TX-1234",
    property: "Bungalow with Pool",
    date: "2023-04-04",
    client: "Alex Johnson",
    amount: 450000,
    status: "In progress"
  },
  {
    id: "TX-1233",
    property: "Penthouse Suite",
    date: "2023-04-01",
    client: "Sarah Williams",
    amount: 820000,
    status: "Completed"
  },
  {
    id: "TX-1232",
    property: "Modern Office Space",
    date: "2023-03-28",
    client: "Tech Innovations Inc.",
    amount: 950000,
    status: "Completed"
  },
  {
    id: "TX-1231",
    property: "Downtown Apartment",
    date: "2023-03-25",
    client: "Michael Davis",
    amount: 320000,
    status: "Completed"
  },
  {
    id: "TX-1230",
    property: "Retail Space",
    date: "2023-03-20",
    client: "Fashion Boutique LLC",
    amount: 580000,
    status: "Cancelled"
  }
];

const Transactions = () => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'in progress':
        return "bg-blue-100 text-blue-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Button className="gap-1">
          <Plus size={16} />
          New Transaction
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowUpDown size={16} />
            Sort
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Property</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Client</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{transaction.id}</td>
                    <td className="py-3 px-4">{transaction.property}</td>
                    <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4">{transaction.client}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(transaction.amount)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
