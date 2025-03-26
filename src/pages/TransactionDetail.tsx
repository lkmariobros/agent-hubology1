import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, Home, User, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/propertyUtils';
import { useTransaction } from '@/hooks/useTransactions';
import { Transaction } from '@/types';
import StatusBadge from '@/components/admin/commission/StatusBadge';
import DocumentList from '@/components/transactions/DocumentList';
import PropertyCard from '@/components/properties/PropertyCard';
import TransactionTimeline from '@/components/transactions/TransactionTimeline';
import CommissionBreakdownCard from '@/components/transactions/CommissionBreakdownCard';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transaction, isLoading, error } = useTransaction(id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <TransactionInfoCardSkeleton />
            <DocumentListSkeleton />
          </div>
          <div className="space-y-6">
            <PropertyCardSkeleton />
            <CommissionBreakdownSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        
        <Card className="p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Error Loading Transaction</h2>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'The requested transaction could not be found.'}
            </p>
            <Button onClick={() => navigate('/transactions')}>
              Return to Transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TransactionInfoCard transaction={transaction} isLoading={isLoading} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Transaction Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTimeline transaction={transaction} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList documents={transaction.documents || []} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.notes ? (
                <p className="text-sm">{transaction.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes available for this transaction.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {transaction.property && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyCard 
                  property={{
                    id: transaction.propertyId,
                    title: transaction.property.title,
                    address: transaction.property.address,
                    // Add other required properties with default values
                    description: '',
                    price: transaction.price || 0,
                    type: transaction.type || 'Unknown',
                    subtype: '',
                    features: {},
                    bedrooms: 0,
                    bathrooms: 0,
                    area: 0,
                    images: [],
                    status: '',
                    listedBy: '',
                    createdAt: '',
                    updatedAt: '',
                    featured: false,
                    transactionType: ''
                  }}
                  compact
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate(`/properties/${transaction.propertyId}`)}
                >
                  View Property Details
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommissionBreakdownCard 
                commission={transaction.commission}
                price={transaction.price || 0}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Agent</h3>
                <p>{transaction.agent?.name || transaction.agentId}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Buyer</h3>
                <p>{transaction.buyer?.name || transaction.buyerId || 'N/A'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Seller</h3>
                <p>{transaction.seller?.name || transaction.sellerId || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Skeleton loaders for the transaction detail page
const TransactionInfoCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DocumentListSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-5 w-40 bg-muted rounded"></div>
            </div>
            <div className="h-8 w-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const PropertyCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-40 bg-muted rounded animate-pulse mb-4"></div>
      <div className="h-5 w-full bg-muted rounded animate-pulse mb-2"></div>
      <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-4"></div>
      <div className="h-9 w-full bg-muted rounded animate-pulse"></div>
    </CardContent>
  </Card>
);

const CommissionBreakdownSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
        <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
        <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

const TransactionInfoCard = ({ transaction, isLoading }: { transaction: Transaction | null, isLoading: boolean }) => {
  if (isLoading) {
    return <TransactionInfoCardSkeleton />;
  }
  
  if (!transaction) {
    return <div>No transaction data available</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Transaction ID</h4>
            <p>{transaction.id.slice(0, 8)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
            <p>{formatDate(transaction.date)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
            <StatusBadge status={transaction.status} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Agent</h4>
            <p>{transaction.agent?.name || transaction.agentId}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
            <p className="font-semibold">{formatCurrency(transaction.price || 0)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Commission</h4>
            <p className="font-semibold">{formatCurrency(transaction.commission)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Buyer</h4>
            <p>{transaction.buyer?.name || transaction.buyerId || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Seller</h4>
            <p>{transaction.seller?.name || transaction.sellerId || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetail;
