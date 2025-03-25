
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Trash2, FileDown, Calendar, DollarSign, User, Home } from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useTransactionQuery, useDeleteTransactionMutation } = useTransactions();
  
  const { data: transaction, isLoading, isError } = useTransactionQuery(id || '');
  const deleteMutation = useDeleteTransactionMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id || '');
        navigate('/transactions');
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(4).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading transaction details</p>
              <Button onClick={() => navigate('/transactions')}>
                Return to Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case 'in progress':
      case 'in-progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/transactions')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Transaction #{id?.slice(0, 8)}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/transactions/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Created on {new Date(transaction.date).toLocaleDateString()}
              </CardDescription>
            </div>
            <div>
              {getStatusBadge(transaction.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="property">Property</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    Transaction Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span>{id}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{transaction.type === 'developer' ? 'Developer Project' : 'Individual Property'}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{getStatusBadge(transaction.status)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Agent:</span>
                      <span>{transaction.agent?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    Client Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Buyer:</span>
                      <span>{transaction.buyer?.name || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Seller:</span>
                      <span>{transaction.seller?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notes</h3>
                <p className="text-muted-foreground">
                  {transaction.notes || 'No notes provided for this transaction.'}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="property">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-muted-foreground" />
                    Property Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Property:</span>
                        <span>{transaction.property?.title || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>
                          {transaction.property?.address?.city || 'N/A'}, {transaction.property?.address?.state || ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Transaction Value:</span>
                        <span className="font-medium">{formatCurrency(transaction.price || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="commission">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                      Commission Details
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Total Commission:</span>
                        <span className="font-medium">{formatCurrency(transaction.commission)}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Transaction Value:</span>
                        <span>{formatCurrency(transaction.price || 0)}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Commission Rate:</span>
                        <span>{(transaction.commission / (transaction.price || 1) * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Transaction Documents</h3>
                {transaction.documents && transaction.documents.length > 0 ? (
                  <ul className="space-y-4">
                    {transaction.documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <span>{typeof doc === 'string' ? doc : doc.name}</span>
                        <Button variant="ghost" size="sm">
                          <FileDown className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No documents attached to this transaction.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetail;
