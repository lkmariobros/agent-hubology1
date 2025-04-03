
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
}

const InstallmentsList: React.FC<InstallmentsListProps> = ({ installments }) => {
  // Sort installments by number
  const sortedInstallments = [...installments].sort(
    (a, b) => a.installmentNumber - b.installmentNumber
  );
  
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
