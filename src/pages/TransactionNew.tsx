
import React from 'react';
import EnhancedTransactionForm from '@/components/transactions/EnhancedTransactionForm';

const TransactionNew = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Add New Transaction</h1>
      <EnhancedTransactionForm />
    </div>
  );
};

export default TransactionNew;
