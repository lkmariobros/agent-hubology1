
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  AlertCircle,
  CheckCircle, 
  Banknote, 
  CheckCheck 
} from 'lucide-react';
import { useCommissionApprovalStats } from '@/hooks/useCommissionApproval';
import { formatCurrency } from '@/utils/format';

const SummaryCards: React.FC = () => {
  const { data, isLoading } = useCommissionApprovalStats();
  
  // Get stats if available, or use default values for loading state
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
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const summaryItems = [
    {
      label: 'Pending Approval',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950/50'
    },
    {
      label: 'Under Review',
      value: stats.underReview,
      icon: AlertCircle,
      color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/50'
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-500 bg-green-100 dark:bg-green-950/50'
    },
    {
      label: 'Ready for Payment',
      value: stats.readyForPayment,
      icon: Banknote,
      color: 'text-purple-500 bg-purple-100 dark:bg-purple-950/50'
    },
    {
      label: 'Paid',
      value: stats.paid,
      icon: CheckCheck,
      color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/50'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {summaryItems.map((item, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Additional value summary cards */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-5">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full mr-3 text-yellow-500 bg-yellow-100 dark:bg-yellow-950/50">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Value</p>
                <p className="text-xl font-bold">{formatCurrency(stats.pendingValue)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 rounded-full mr-3 text-green-500 bg-green-100 dark:bg-green-950/50">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved Value</p>
                <p className="text-xl font-bold">{formatCurrency(stats.approvedValue)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 rounded-full mr-3 text-emerald-500 bg-emerald-100 dark:bg-emerald-950/50">
                <CheckCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Value</p>
                <p className="text-xl font-bold">{formatCurrency(stats.paidValue)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
