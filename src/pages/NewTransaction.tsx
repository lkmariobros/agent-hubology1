
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedTransactionForm from '@/components/transactions/EnhancedTransactionForm';

const NewTransaction = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Transaction</h1>
        <EnhancedTransactionForm />
      </div>
    </MainLayout>
  );
};

export default NewTransaction;
