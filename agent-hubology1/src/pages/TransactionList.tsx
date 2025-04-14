
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Filter, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/admin/commission/StatusBadge';
import { useClerkTransactions, useCreateTransactionMutation } from '@/hooks/useClerkTransactions';
import { format } from 'date-fns';
import { useAuth } from '@clerk/clerk-react';

const TransactionList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const createTransaction = useCreateTransactionMutation();

  // Fetch transactions using the Clerk-authenticated hook
  const { data, isLoading, isError } = useClerkTransactions(page, pageSize);

  // Extract transactions and total count
  const transactions = data?.transactions || [];
  const totalCount = data?.total || 0;

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    const propertyTitle = transaction.property?.title || '';

    return (
      propertyTitle.toLowerCase().includes(searchLower) ||
      transaction.status?.toLowerCase().includes(searchLower) ||
      transaction.transaction_value?.toString().includes(searchLower)
    );
  });

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleNewTransaction = () => {
    navigate('/transactions/new');
  };

  // Debug function to create a test transaction
  const createTestTransaction = async () => {
    if (!userId) {
      alert('You must be logged in to create a test transaction');
      return;
    }

    try {
      const result = await createTransaction.mutateAsync({
        transactionDate: new Date().toISOString().split('T')[0],
        transactionValue: 100000,
        commissionRate: 5,
        commissionAmount: 5000,
        notes: 'Test transaction created for debugging',
        buyer: { name: 'Test Buyer', email: 'buyer@test.com', phone: '123-456-7890' },
        seller: { name: 'Test Seller', email: 'seller@test.com', phone: '123-456-7890' }
      });

      console.log('Test transaction created:', result);
      alert('Test transaction created successfully!');
    } catch (error) {
      console.error('Error creating test transaction:', error);
      alert(`Error creating test transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage and track your property transactions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewTransaction} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Transaction
          </Button>
          <Button onClick={createTestTransaction} variant="outline">
            Create Test Transaction
          </Button>
          <Button
            onClick={() => alert(`Current User ID: ${userId || 'Not logged in'}`)}
            variant="outline"
          >
            Show User ID
          </Button>
          <Button
            onClick={() => {
              // Force refresh the data
              window.location.reload();
            }}
            variant="outline"
          >
            Force Refresh
          </Button>
        </div>
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
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Transaction List</CardTitle>
          <div className="text-sm text-muted-foreground">
            User ID: {userId || 'Not logged in'} |
            Transactions: {transactions.length} |
            Loading: {isLoading ? 'Yes' : 'No'} |
            Error: {isError ? 'Yes' : 'No'}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading transactions. Please try again.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleNewTransaction}
              >
                Create Your First Transaction
              </Button>

              {/* Debug section */}
              <div className="mt-8 text-left p-4 bg-muted rounded-md">
                <h3 className="font-semibold mb-2">Debug Information:</h3>
                <p>User ID: {userId}</p>
                <p>Raw Transactions Count: {transactions.length}</p>
                <p>Filtered Transactions Count: {filteredTransactions.length}</p>
                <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                <p>Error: {isError ? 'Yes' : 'No'}</p>
                <div className="mt-4">
                  <p className="font-semibold">Raw Transactions Data:</p>
                  <pre className="text-xs mt-2 p-2 bg-background overflow-auto max-h-40">
                    {JSON.stringify(transactions, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Property</th>
                    <th className="text-left py-3 px-4">Value</th>
                    <th className="text-left py-3 px-4">Commission</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{transaction.property?.title || 'Unnamed Property'}</td>
                      <td className="py-3 px-4">{formatCurrency(transaction.transaction_value)}</td>
                      <td className="py-3 px-4">{formatCurrency(transaction.commission_amount)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={transaction.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">{formatDate(transaction.transaction_date)}</td>
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

              {/* Pagination */}
              {totalCount > pageSize && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} transactions
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page * pageSize >= totalCount}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;
