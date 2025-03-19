
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TransactionForm from '@/components/transactions/TransactionForm';

const TransactionNew = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New Transaction</h1>
        <TransactionForm />
      </div>
    </MainLayout>
  );
};

export default TransactionNew;
