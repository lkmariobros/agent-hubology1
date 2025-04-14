
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Eye, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useClerkTransactions } from '@/hooks/useClerkTransactions';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  onViewAll?: () => void;
  limit?: number;
}

const RecentTransactions = ({ onViewAll, limit = 5 }: RecentTransactionsProps) => {
  const navigate = useNavigate();

  // Fetch transactions using the Clerk-authenticated hook
  const { data, isLoading } = useClerkTransactions(1, limit);

  // Extract transactions
  const transactions = data?.transactions || [];

  const handleViewTransaction = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  const handleEditTransaction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/transactions/${id}/edit`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle size="md">Recent Transactions</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll || (() => navigate('/transactions'))}
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex items-center space-x-4 p-3 rounded-lg"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-2 ml-auto" />
                  <Skeleton className="h-5 w-16 ml-auto" />
                </div>
              </div>
            ))
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => handleViewTransaction(transaction.id)}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {transaction.property?.title || 'Unnamed Property'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.transaction_date ? format(new Date(transaction.transaction_date), 'MMM d, yyyy') : 'No date'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm font-medium text-foreground">
                    ${transaction.commission_amount?.toLocaleString() || '0'}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] py-0 h-5 mt-0.5",
                      transaction.status?.toLowerCase() === 'completed' ? 'text-green-400 border-green-400/30' :
                      transaction.status?.toLowerCase() === 'pending' ? 'text-yellow-400 border-yellow-400/30' :
                      'text-red-400 border-red-400/30'
                    )}
                  >
                    {transaction.status || 'Unknown'}
                  </Badge>
                  <div className="flex gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTransaction(transaction.id);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleEditTransaction(transaction.id, e)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}

          {!isLoading && transactions.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <p className="mt-2 text-sm text-muted-foreground">No transactions found</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/transactions/new')}
              >
                Create transaction
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
