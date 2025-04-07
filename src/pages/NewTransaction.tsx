
import React from 'react';
import EnhancedTransactionForm from '@/components/transactions/EnhancedTransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

const NewTransaction = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Transaction</h1>
      
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedTransactionForm />
        </CardContent>
      </Card>
      
      {/* The Toaster component is now global in main.tsx, so we don't need it here */}
    </div>
  );
};

export default NewTransaction;
