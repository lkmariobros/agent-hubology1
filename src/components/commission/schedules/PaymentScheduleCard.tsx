
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Clock, X, AlertCircle } from 'lucide-react';
import { CommissionPaymentSchedule, CommissionInstallment } from '@/types/commission';
import useCommissionSchedules from '@/hooks/useCommissionSchedules';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/useAuth';

interface PaymentScheduleCardProps {
  schedule: CommissionPaymentSchedule;
  showActions?: boolean;
}

const PaymentScheduleCard: React.FC<PaymentScheduleCardProps> = ({ 
  schedule,
  showActions = true
}) => {
  const { isAdmin } = useAuth();
  const { useUpdateInstallmentStatusMutation } = useCommissionSchedules();
  const updateInstallment = useUpdateInstallmentStatusMutation();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getStatusBadge = (status: CommissionInstallment['status']) => {
    switch (status) {
      case 'Paid':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'Processing':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'Cancelled':
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'Pending':
      default:
        const dueDate = new Date(status === 'Pending' ? (schedule.installments?.[0]?.due_date || '') : '');
        const isOverdue = dueDate && dueDate < new Date();
        
        return (
          <Badge variant={isOverdue ? "destructive" : "outline"} className={cn(
            isOverdue ? "" : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
          )}>
            {isOverdue ? <AlertCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
            {isOverdue ? "Overdue" : "Pending"}
          </Badge>
        );
    }
  };
  
  const handleMarkAsPaid = (installmentId: string) => {
    updateInstallment.mutate({
      installmentId,
      status: 'Paid'
    });
  };
  
  const getProgressPercentage = () => {
    if (!schedule.total_amount) return 0;
    return ((schedule.total_amount - schedule.remaining_amount) / schedule.total_amount) * 100;
  };

  // Sort installments by installment number
  const sortedInstallments = [...(schedule.installments || [])].sort(
    (a, b) => a.installment_number - b.installment_number
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Payment Schedule</CardTitle>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(schedule.created_at)}
            </p>
          </div>
          {getStatusBadge(sortedInstallments[0]?.status || 'Pending')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="font-medium">{formatCurrency(schedule.total_amount)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining Amount</span>
          <span className="font-medium">{formatCurrency(schedule.remaining_amount)}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{getProgressPercentage().toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium">Installments</p>
          
          {sortedInstallments.map((installment) => (
            <div 
              key={installment.id} 
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                installment.status === 'Paid' ? "bg-green-500/10" : 
                installment.status === 'Processing' ? "bg-blue-500/10" : 
                installment.status === 'Cancelled' ? "bg-red-500/10" : 
                new Date(installment.due_date) < new Date() ? "bg-red-500/10" : 
                "bg-amber-500/10"
              )}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">Installment {installment.installment_number}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(installment.due_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatCurrency(installment.amount)}</span>
                
                {showActions && isAdmin && installment.status === 'Pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7"
                    onClick={() => handleMarkAsPaid(installment.id)}
                    disabled={updateInstallment.isPending}
                  >
                    Mark Paid
                  </Button>
                )}
                
                {installment.status !== 'Pending' && (
                  <Badge variant={
                    installment.status === 'Paid' ? "default" :
                    installment.status === 'Processing' ? "secondary" :
                    "destructive"
                  } className="ml-2">
                    {installment.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleCard;
