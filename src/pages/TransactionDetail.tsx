import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { useAuth } from '@/context/AuthContext';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  
  return (
    <div className="container mx-auto">
      <Suspense fallback={<LoadingIndicator text="Loading transaction details..." />}>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {id ? (
              <div>
                <p>Transaction ID: {id}</p>
                {isAdmin && (
                  <p>Admin view</p>
                )}
              </div>
            ) : (
              <p>No transaction ID provided.</p>
            )}
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
};

export default TransactionDetail;
