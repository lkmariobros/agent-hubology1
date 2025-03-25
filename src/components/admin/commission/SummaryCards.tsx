
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCommissionApprovalStats } from '@/hooks/useCommissionApproval';
import { formatCurrency } from '@/utils/propertyUtils';
import { Clock, CheckCircle, Banknote, XCircle, Loader2 } from 'lucide-react';

const SummaryCards: React.FC = () => {
  const { data, isLoading } = useCommissionApprovalStats();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-muted/50">
            <CardContent className="p-4 h-24 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const stats = data?.stats || {
    pending: 0,
    underReview: 0,
    approved: 0,
    readyForPayment: 0,
    paid: 0,
    pendingValue: 0,
    approvedValue: 0,
    paidValue: 0
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <h2 className="text-2xl font-bold">{stats.pending + stats.underReview}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Value: {formatCurrency(stats.pendingValue)}
              </p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <h2 className="text-2xl font-bold">{stats.approved}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Value: {formatCurrency(stats.approvedValue)}
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ready for Payment</p>
              <h2 className="text-2xl font-bold">{stats.readyForPayment}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to process
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Banknote className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <h2 className="text-2xl font-bold">{stats.paid}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Value: {formatCurrency(stats.paidValue)}
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
