
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedTransactionForm from '@/components/transactions/EnhancedTransactionForm';

const TransactionNew = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <h1 className="page-title">Add New Transaction</h1>
        <EnhancedTransactionForm />
      </div>
    </MainLayout>
  );
};

export default TransactionNew;
