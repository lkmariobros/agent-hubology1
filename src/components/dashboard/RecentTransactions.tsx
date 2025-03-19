
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign } from 'lucide-react';
import { Transaction } from '@/types';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {transaction.property?.title || `Property #${transaction.propertyId}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  ${transaction.commission.toLocaleString()}
                </p>
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-[10px] py-0 h-5 mt-1 border-white/10",
                    transaction.status === 'completed' ? 'text-green-400 border-green-400/30' : 
                    transaction.status === 'pending' ? 'text-yellow-400 border-yellow-400/30' : 
                    'text-red-400 border-red-400/30'
                  )}
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <p className="mt-2 text-sm text-muted-foreground">No transactions found</p>
              <Button variant="outline" size="sm" className="mt-4">
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
