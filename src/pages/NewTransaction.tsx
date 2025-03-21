
import React from 'react';
import EnhancedTransactionForm from '@/components/transactions/EnhancedTransactionForm';

const NewTransaction = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Transaction</h1>
      <EnhancedTransactionForm />
    </div>
  );
};

export default NewTransaction;
