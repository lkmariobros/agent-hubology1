
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Filter } from 'lucide-react';
import StatusBadge from '@/components/admin/commission/StatusBadge';

const TransactionList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Placeholder transactions data
  const transactions = [
    {
      id: '1',
      propertyTitle: 'Modern Downtown Apartment',
      transactionType: 'Sale',
      transactionValue: 425000,
      commission: 10625,
      status: 'Completed',
      date: '2024-06-15'
    },
    {
      id: '2',
      propertyTitle: 'Commercial Office Space',
      transactionType: 'Rent',
      transactionValue: 5000,
      commission: 2500,
      status: 'Pending',
      date: '2024-06-18'
    },
    {
      id: '3',
      propertyTitle: 'Suburban Family Home',
      transactionType: 'Sale',
      transactionValue: 750000,
      commission: 18750,
      status: 'Under Review',
      date: '2024-06-10'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleNewTransaction = () => {
    navigate('/transactions/new');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage and track your property transactions</p>
        </div>
        <Button onClick={handleNewTransaction} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Transaction
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Property</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Value</th>
                  <th className="text-left py-3 px-4">Commission</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{transaction.propertyTitle}</td>
                    <td className="py-3 px-4">{transaction.transactionType}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.transactionValue)}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.commission)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={transaction.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                      >
                        View
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

export default TransactionList;
