
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

interface InstallmentsListProps {
  installments: ScheduleInstallment[];
  emptyMessage?: string;
}

const InstallmentsList: React.FC<InstallmentsListProps> = ({ 
  installments,
  emptyMessage = "No installments found" 
}) => {
  // Sort installments by number
  const sortedInstallments = [...installments].sort(
    (a, b) => a.installmentNumber - b.installmentNumber
  );
  
  if (installments.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Installment</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Days After Transaction</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedInstallments.map((installment) => (
          <TableRow key={installment.id}>
            <TableCell>{installment.installmentNumber}</TableCell>
            <TableCell>{installment.percentage}%</TableCell>
            <TableCell>{installment.daysAfterTransaction} days</TableCell>
            <TableCell>{installment.description || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InstallmentsList;
