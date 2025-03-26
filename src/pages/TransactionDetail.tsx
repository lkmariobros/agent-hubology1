import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  User, 
  Home, 
  DollarSign, 
  Calendar, 
  FileText, 
  Phone, 
  Mail,
  Building2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useTransaction } from '@/hooks/useTransactions';
import { formatCurrency } from '@/utils/propertyUtils';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transactionData, isLoading, error } = useTransaction(id || '');

  if (error) {
    toast.error("Failed to load transaction details");
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/transactions')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Error loading transaction details. Please try again later.</p>
        </div>
      </div>
    );
  }

  const transaction = transactionData?.data;

  return (
    <div className="space-y-4">
      {/* Header with navigation and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/transactions')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Button>
        </div>
        
        {!isLoading && transaction && 
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/transactions/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm('Are you sure you want to delete this transaction?')) {
                  // Transaction deletion logic would go here
                  toast.success("Transaction deleted successfully");
                  navigate('/transactions');
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      </div>

      {isLoading ? (
        <TransactionDetailSkeleton />
      ) : transaction ? (
        <>
          {/* Transaction Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Basic Info */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Transaction Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Transaction #{transaction.id}
                    </h1>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <p className="text-sm">
                        Date: {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                      {formatCurrency(transaction.commission)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {transaction.status || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <DollarSign className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="text-sm font-medium">{formatCurrency(transaction.price || 0)}</span>
                    </div>
                    
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <Home className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Property</span>
                      <span className="text-sm font-medium">{transaction.property?.title || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <User className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Buyer</span>
                      <span className="text-sm font-medium">{transaction.buyer?.name || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <User className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Seller</span>
                      <span className="text-sm font-medium">{transaction.seller?.name || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Agent Information */}
                  <div>
                    <h3 className="text-sm font-medium">Agent</h3>
                    <div className="flex items-center mt-2">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>{transaction.agentId || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Notes and Documents */}
            <div className="lg:col-span-1 space-y-4">
              {/* Notes Section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {transaction.notes ? (
                    <p className="text-muted-foreground whitespace-pre-line">{transaction.notes}</p>
                  ) : (
                    <div className="text-center py-2">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No notes available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Documents Section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {transaction.documents && Array.isArray(transaction.documents) && transaction.documents.length > 0 ? (
                    <ul className="space-y-2">
                      {transaction.documents.map((doc, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <span>{doc.name || `Document ${index + 1}`}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Uploaded on {new Date().toLocaleDateString()}</span>
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-2">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No documents available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <p className="mt-2 text-sm text-muted-foreground">Transaction not found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/transactions')}>
            Back to Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for transaction details
const TransactionDetailSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
      
      <Skeleton className="h-[150px] w-full rounded-lg" />
      
      <Skeleton className="h-12 w-full rounded-lg" />
      
      <Skeleton className="h-[150px] w-full rounded-lg" />
    </div>
  );
};

export default TransactionDetail;
