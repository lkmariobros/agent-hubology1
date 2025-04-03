
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScheduleInstallment } from '@/types/commission';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formattingUtils';
import { format, addDays } from 'date-fns';

interface InstallmentsListProps {
  installments: ScheduleInstallment[];
  emptyMessage?: string;
  isLoading?: boolean;
  baseDate?: Date;
  showAmountColumn?: boolean;
  commissionAmount?: number;
}

const InstallmentsList: React.FC<InstallmentsListProps> = ({ 
  installments,
  emptyMessage = "No installments found",
  isLoading = false,
  baseDate,
  showAmountColumn = false,
  commissionAmount = 0
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  if (installments.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  // Sort installments by number
  const sortedInstallments = [...installments].sort(
    (a, b) => a.installmentNumber - b.installmentNumber
  );
  
  // Helper function to calculate estimated date if baseDate is provided
  const getEstimatedDate = (daysAfterTransaction: number) => {
    if (!baseDate) return null;
    return addDays(baseDate, daysAfterTransaction);
  };
  
  // Helper function to calculate amount based on percentage
  const calculateAmount = (percentage: number) => {
    return (percentage / 100) * commissionAmount;
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Installment</TableHead>
          <TableHead>Percentage</TableHead>
          {showAmountColumn && <TableHead>Amount</TableHead>}
          <TableHead>Days After Transaction</TableHead>
          {baseDate && <TableHead>Estimated Date</TableHead>}
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedInstallments.map((installment) => {
          const estimatedDate = getEstimatedDate(installment.daysAfterTransaction);
          return (
            <TableRow key={installment.id}>
              <TableCell>{installment.installmentNumber}</TableCell>
              <TableCell>{installment.percentage}%</TableCell>
              {showAmountColumn && (
                <TableCell>{formatCurrency(calculateAmount(installment.percentage))}</TableCell>
              )}
              <TableCell>{installment.daysAfterTransaction} days</TableCell>
              {baseDate && (
                <TableCell>
                  {estimatedDate ? format(estimatedDate, 'MMM d, yyyy') : '-'}
                </TableCell>
              )}
              <TableCell>{installment.description || '-'}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default InstallmentsList;
