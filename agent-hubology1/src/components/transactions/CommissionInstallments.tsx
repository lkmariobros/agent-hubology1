import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommissionInstallment {
  id: string;
  installment_number: number;
  amount: number;
  percentage: number;
  scheduled_date: string;
  status: string;
  actual_payment_date?: string;
  notes?: string;
}

interface CommissionInstallmentsProps {
  transactionId: string;
  isLoading?: boolean;
  installments?: CommissionInstallment[];
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return 'Invalid date';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'overdue':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'text-green-500 bg-green-50';
    case 'pending':
      return 'text-amber-500 bg-amber-50';
    case 'overdue':
      return 'text-red-500 bg-red-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

export const CommissionInstallments: React.FC<CommissionInstallmentsProps> = ({
  transactionId,
  isLoading = false,
  installments = []
}) => {
  if (isLoading) {
    return <CommissionInstallmentsSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Installments</CardTitle>
      </CardHeader>
      <CardContent>
        {installments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No commission installments found for this transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Percentage</th>
                  <th className="text-left py-3 px-4">Scheduled Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((installment) => (
                  <tr key={installment.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{installment.installment_number}</td>
                    <td className="py-3 px-4">{formatCurrency(installment.amount)}</td>
                    <td className="py-3 px-4">{installment.percentage}%</td>
                    <td className="py-3 px-4">{formatDate(installment.scheduled_date)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getStatusIcon(installment.status)}
                        <span className={cn("ml-2 px-2 py-1 rounded-full text-xs font-medium", getStatusColor(installment.status))}>
                          {installment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatDate(installment.actual_payment_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CommissionInstallmentsSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CommissionInstallments;
