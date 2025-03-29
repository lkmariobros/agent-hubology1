
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTransactionQuery } from '@/hooks/useTransactions';
import useAuth from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LoadingIndicator from '@/components/ui/loading-indicator';

// Component that shows transaction details
const TransactionDetail = () => {
  console.log('TransactionDetail: Component rendering');
  const { id } = useParams<{ id: string }>();
  const { loading: authLoading, isAuthenticated } = useAuth();
  
  console.log('TransactionDetail: Auth state =', { authLoading, isAuthenticated });
  
  // Use the transaction query hook
  const { data: transaction, isLoading } = useTransactionQuery(id || '');
  
  // Check if loading from either auth or data fetching
  if (authLoading) {
    console.log('TransactionDetail: Auth is still loading');
    return <LoadingIndicator fullScreen size="lg" text="Verifying authentication..." />;
  }
  
  // Check if authenticated
  if (!isAuthenticated) {
    console.log('TransactionDetail: Not authenticated');
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please sign in to view transaction details.</p>
        </Card>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    console.log('TransactionDetail: Transaction data is loading');
    return <LoadingIndicator fullScreen size="md" text="Loading transaction details..." />;
  }

  // If transaction not found
  if (!transaction) {
    console.log('TransactionDetail: Transaction not found');
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Transaction Not Found</h2>
          <p>The requested transaction could not be found.</p>
        </Card>
      </div>
    );
  }

  console.log('TransactionDetail: Rendering transaction', transaction);

  // Display transaction details
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Transaction #{id}</h1>
      <Separator className="my-4" />

      {/* Transaction info */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {transaction.status}</p>
            <p><strong>Price:</strong> ${transaction.price?.toLocaleString()}</p>
            <p><strong>Commission:</strong> ${transaction.commission?.toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Commission Rate:</strong> {transaction.commissionRate}%</p>
            <p><strong>Property:</strong> {transaction.property?.title}</p>
            <p><strong>Agent:</strong> {transaction.agent?.name}</p>
            <p><strong>Closing Date:</strong> {transaction.closingDate ? new Date(transaction.closingDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Additional transaction sections would go here */}
    </div>
  );
};

export default TransactionDetail;
