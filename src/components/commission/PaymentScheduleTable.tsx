
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentSchedule } from '@/types/commission';
import InstallmentsList from './InstallmentsList';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentScheduleTableProps {
  schedule: PaymentSchedule;
  isLoading?: boolean;
  error?: Error | null;
}

const PaymentScheduleTable: React.FC<PaymentScheduleTableProps> = ({ 
  schedule, 
  isLoading = false,
  error = null
}) => {
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center mb-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-16 ml-2" />
        </div>
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="border rounded-md p-6 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
        <h3 className="font-medium">Error loading payment schedule</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="font-medium">{schedule.name}</h3>
        {schedule.isDefault && <Badge className="ml-2">Default</Badge>}
      </div>
      {schedule.description && <p className="text-sm text-muted-foreground mb-4">{schedule.description}</p>}
      
      <InstallmentsList 
        installments={schedule.installments || []} 
        emptyMessage="No installments defined for this schedule"
      />
    </div>
  );
};

export default PaymentScheduleTable;
