
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PaymentSchedule } from '@/types/commission';

interface PaymentScheduleTableProps {
  schedule: PaymentSchedule;
}

const PaymentScheduleTable: React.FC<PaymentScheduleTableProps> = ({ schedule }) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="font-medium">{schedule.name}</h3>
        {schedule.isDefault && <Badge className="ml-2">Default</Badge>}
      </div>
      {schedule.description && <p className="text-sm text-muted-foreground mb-4">{schedule.description}</p>}
      
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
          {schedule.installments
            ?.sort((a, b) => a.installmentNumber - b.installmentNumber)
            .map((installment) => (
              <TableRow key={installment.id}>
                <TableCell>{installment.installmentNumber}</TableCell>
                <TableCell>{installment.percentage}%</TableCell>
                <TableCell>{installment.daysAfterTransaction} days</TableCell>
                <TableCell>{installment.description || '-'}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentScheduleTable;
