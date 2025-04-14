
import React from 'react';
import ClerkTransactionForm from '@/components/transactions/ClerkTransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewTransaction = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Transaction</h1>
      
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClerkTransactionForm />
        </CardContent>
      </Card>

    </div>
  );
};

export default NewTransaction;
