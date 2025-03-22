
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import EmptyState from "./EmptyState";

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading = false,
  onViewAll,
  className
}) => {
  return (
    <Card className={cn("border-border bg-card shadow-sm h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-border">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    transaction.status === 'completed' ? "bg-emerald-500/10" : "bg-amber-500/10"
                  )}>
                    {transaction.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">ID #{transaction.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${transaction.commission.toLocaleString()}</p>
                  <p className={cn(
                    "text-xs capitalize",
                    transaction.status === 'completed' ? "text-emerald-500" : "text-amber-500"
                  )}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            type="transactions" 
            onAction={onViewAll}
            actionLabel="Create transaction"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
