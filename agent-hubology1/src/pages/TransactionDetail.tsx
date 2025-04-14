
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTransactionQuery } from '@/hooks/useTransactions';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from '@/components/admin/commission/StatusBadge';
import CommissionInstallments from '@/components/transactions/CommissionInstallments';
import useCommissionInstallments from '@/hooks/useCommissionInstallments';

// Format currency for display
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date for display
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return 'Invalid date';
  }
};

// Component that shows transaction details
const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoaded, isSignedIn } = useAuth();

  // Use the transaction query hook
  const { data: transaction, isLoading, error } = useTransactionQuery(id || '');

  // Fetch commission installments
  const { data: installments, isLoading: isLoadingInstallments } = useCommissionInstallments(id || '');

  // If there was an error fetching the transaction
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/transactions" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading the transaction details.</p>
            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if loading auth
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  // Check if authenticated
  if (!isSignedIn) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view transaction details.</p>
            <Button className="mt-4" asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return <TransactionDetailSkeleton />;
  }

  // If transaction not found
  if (!transaction) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/transactions" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested transaction could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display transaction details
  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/transactions" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction Details</h1>
        <StatusBadge status={transaction.status} size="lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main transaction details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Property</span>
                    <p className="font-medium">{transaction.property?.title || 'Unnamed Property'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Transaction Date</span>
                    <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Closing Date</span>
                    <p className="font-medium">{formatDate(transaction.closing_date)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Transaction Value</span>
                    <p className="font-medium">{formatCurrency(transaction.transaction_value)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Commission Rate</span>
                    <p className="font-medium">{transaction.commission_rate}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Commission Amount</span>
                    <p className="font-medium">{formatCurrency(transaction.commission_amount)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <p className="font-medium">{transaction.status}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Created</span>
                    <p className="font-medium">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Buyer</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {transaction.buyer_name || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Email:</span> {transaction.buyer_email || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {transaction.buyer_phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Seller</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {transaction.seller_name || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Email:</span> {transaction.seller_email || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {transaction.seller_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.documents && transaction.documents.length > 0 ? (
                <ul className="space-y-2">
                  {transaction.documents.map((doc: any) => (
                    <li key={doc.id} className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span>{doc.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No documents uploaded</p>
              )}
              <Button variant="outline" className="w-full mt-4">
                Upload Document
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.notes ? (
                <p>{transaction.notes}</p>
              ) : (
                <p className="text-muted-foreground">No notes added</p>
              )}
            </CardContent>
          </Card>

          {/* Commission Status */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Total Commission</span>
                  <p className="font-medium">{formatCurrency(transaction.commission_amount)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <p className="font-medium">{transaction.status}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Installments Generated</span>
                  <p className="font-medium">{transaction.installments_generated ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commission Installments Section */}
      <div className="mt-6">
        <CommissionInstallments
          transactionId={id || ''}
          isLoading={isLoadingInstallments}
          installments={installments}
        />
      </div>
    </div>
  );
};

// Skeleton loader when transaction data is being fetched
const TransactionDetailSkeleton = () => (
  <div className="p-6">
    <div className="mb-6">
      <Skeleton className="h-10 w-40" />
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <Skeleton className="h-10 w-60 mb-4 sm:mb-0" />
      <Skeleton className="h-8 w-24" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default TransactionDetail;
