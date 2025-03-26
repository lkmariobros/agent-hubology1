import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from '@/utils/propertyUtils';
import StatusBadge from '@/components/admin/commission/StatusBadge';
import { useTransactions } from '@/hooks/useTransactions';

const Transactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const { useGetTransactionsQuery } = useTransactions();
  const { data, isLoading, isError, error } = useGetTransactionsQuery();

  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data]);

  const handleCreateTransaction = () => {
    navigate('/transactions/new');
  };

  const handleViewTransaction = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (isError) {
    toast({
      title: "Error",
      description: `Failed to fetch transactions: ${error.message}`,
      variant: "destructive",
    });
    return <div>Error loading transactions.</div>;
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchTerm) ||
      formatDate(transaction.date).toLowerCase().includes(searchTerm) ||
      (transaction.agent?.name && transaction.agent.name.toLowerCase().includes(searchTerm)) ||
      (transaction.property?.title && transaction.property.title.toLowerCase().includes(searchTerm)) ||
      transaction.status.toLowerCase().includes(searchTerm) ||
      formatCurrency(transaction.price || 0).toLowerCase().includes(searchTerm) ||
      formatCurrency(transaction.commission).toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Search Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleCreateTransaction}>
          <Plus className="h-4 w-4 mr-2" />
          Create Transaction
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {transaction.id.slice(0, 8)}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>{transaction.agent?.name || transaction.agentId}</TableCell>
              <TableCell>
                {transaction.property ? (
                  <div>
                    <p className="truncate max-w-[200px]">{transaction.property.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.property.address.city}, {transaction.property.address.state}
                    </p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={transaction.status} />
              </TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.price || 0)}</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.commission)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleViewTransaction(transaction.id)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;
