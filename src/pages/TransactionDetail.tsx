
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  DollarSign, 
  Download, 
  FileText, 
  User, 
  Loader2, 
  MessageSquare, 
  Printer, 
  Edit 
} from 'lucide-react';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { useTransactionQuery } = useTransactions();
  
  // Use the query to fetch transaction data
  const { data: transaction, isLoading, error } = useTransactionQuery(id || '');
  
  // Format price or similar numeric values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case 'in progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !transaction) {
    return (
      <div className="p-6">
        <Link to="/transactions">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Transactions
          </Button>
        </Link>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-destructive mb-4">
              {error ? 'Error loading transaction. Please try again.' : 'Transaction not found.'}
            </p>
            <Link to="/transactions">
              <Button>Return to Transactions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/transactions">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Transactions
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to={`/transactions/${transaction.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" /> Edit Transaction
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Transaction Details</CardTitle>
                  <CardDescription>
                    Transaction ID: {transaction.id}
                  </CardDescription>
                </div>
                <div>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Closing Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{transaction.closingDate ? formatDate(transaction.closingDate) : 'Not set'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Value</p>
                  <p className="text-xl font-bold mt-1">{formatCurrency(transaction.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="text-xl font-bold mt-1 text-green-600">{formatCurrency(transaction.commission)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Property</p>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.property?.title || 'Unknown Property'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transaction.property?.address?.city || ''},
                          {transaction.property?.address?.state || ''}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Buyer</p>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{transaction.buyer?.name || 'Unknown Buyer'}</h3>
                          {transaction.buyer?.email && (
                            <p className="text-sm text-muted-foreground">{transaction.buyer.email}</p>
                          )}
                          {transaction.buyer?.phone && (
                            <p className="text-sm text-muted-foreground">{transaction.buyer.phone}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Seller</p>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{transaction.seller?.name || 'Unknown Seller'}</h3>
                          {transaction.seller?.email && (
                            <p className="text-sm text-muted-foreground">{transaction.seller.email}</p>
                          )}
                          {transaction.seller?.phone && (
                            <p className="text-sm text-muted-foreground">{transaction.seller.phone}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <Card>
                  <CardContent className="p-4">
                    {transaction.notes ? (
                      <p>{transaction.notes}</p>
                    ) : (
                      <p className="text-muted-foreground">No notes available.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Documents</p>
                <Card>
                  <CardContent className="p-4">
                    {transaction.documents && transaction.documents.length > 0 ? (
                      <div className="space-y-2">
                        {transaction.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{doc.name}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No documents available.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{transaction.agent?.name || 'Unknown Agent'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Agent ID: {transaction.agent?.id || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" /> Contact Agent
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Commission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction Value</span>
                <span className="font-medium">{formatCurrency(transaction.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Commission Rate</span>
                <span className="font-medium">
                  {transaction.commissionRate ? `${transaction.commissionRate}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-medium">Total Commission</span>
                <span className="font-bold text-green-600">{formatCurrency(transaction.commission)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" /> Print Commission Report
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" /> Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" /> Download All Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" /> Print Transaction Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
