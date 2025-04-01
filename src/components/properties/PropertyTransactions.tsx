
import React from 'react';

interface PropertyTransactionsProps {
  propertyId: string;
  transactions: any[];
}

const PropertyTransactions: React.FC<PropertyTransactionsProps> = ({ propertyId, transactions }) => {
  return (
    <div>
      <p>Property Transactions for ID: {propertyId}</p>
      <p>Number of transactions: {transactions.length}</p>
      <p>This is a stub component that will list all transactions related to this property.</p>
    </div>
  );
};

export default PropertyTransactions;
