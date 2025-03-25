
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Search, Filter, Download, Plus, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';

const Transactions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  const { useTransactionsQuery } = useTransactions();
  const { data, isLoading, isError } = useTransactionsQuery({
    search: searchQuery,
    limit: 10,
    page: currentPage
  });
  
  const transactions = data?.transactions || [];
  const totalTransactions = data?.total || 0;
  const totalPages = Math.ceil(totalTransactions / 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(0);
  };

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
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input 
              placeholder="Search by property, agent..." 
              className="w-full h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} />
            Filters
          </Button>
          <Button size="sm" type="submit">Search</Button>
        </form>
      </Card>
      
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <p className="text-red-500">Error loading transactions. Please try again.</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No transactions found.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/transactions/new')}
            >
              Create your first transaction
            </Button>
          </div>
        ) : (
          <>
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
            
            {totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalTransactions)} of {totalTransactions} transactions
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
