
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentSchedule } from '@/types/commission';
import InstallmentsList from './InstallmentsList';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentScheduleTableProps {
  schedule: PaymentSchedule;
  isLoading?: boolean;
  error?: Error | null;
  showAmountColumn?: boolean;
  commissionAmount?: number;
}

const PaymentScheduleTable: React.FC<PaymentScheduleTableProps> = ({ 
  schedule, 
  isLoading = false,
  error = null,
  showAmountColumn = false,
  commissionAmount = 0
}) => {
  // Use current date as base date for estimation
  const [baseDate] = useState<Date>(new Date());

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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <span>{schedule.name}</span>
            {schedule.isDefault && <Badge className="ml-2">Default</Badge>}
          </CardTitle>
        </div>
        {schedule.description && (
          <p className="text-sm text-muted-foreground">{schedule.description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <InstallmentsList 
          installments={schedule.installments || []} 
          emptyMessage="No installments defined for this schedule"
          isLoading={isLoading}
          baseDate={baseDate}
          showAmountColumn={showAmountColumn}
          commissionAmount={commissionAmount}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleTable;
