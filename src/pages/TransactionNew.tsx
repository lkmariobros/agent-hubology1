
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TransactionForm from '@/components/transactions/TransactionForm';

const TransactionNew = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <h1 className="page-title">Add New Transaction</h1>
        <TransactionForm />
      </div>
    </MainLayout>
  );
};

export default TransactionNew;
