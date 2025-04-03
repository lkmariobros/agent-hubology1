
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentSchedule } from '@/types/commission';
import InstallmentsList from './InstallmentsList';

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
      
      <InstallmentsList installments={schedule.installments || []} />
    </div>
  );
};

export default PaymentScheduleTable;
