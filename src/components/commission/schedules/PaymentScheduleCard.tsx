
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

// Update the interface to include schedule property
interface PaymentScheduleCardProps {
  date?: string;
  amount?: number;
  status?: 'pending' | 'paid' | 'failed';
  schedule?: any; // Add schedule property
}

const PaymentScheduleCard: React.FC<PaymentScheduleCardProps> = ({ date, amount, status, schedule }) => {
  const { user } = useAuth();
  
  const statusColors = {
    pending: 'text-yellow-500',
    paid: 'text-green-500',
    failed: 'text-red-500',
  };
  
  // Use schedule properties if provided, otherwise use direct props
  const displayDate = schedule ? schedule.date : date;
  const displayAmount = schedule ? schedule.amount : amount;
  const displayStatus = schedule ? schedule.status.toLowerCase() : status;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Date: {new Date(displayDate).toLocaleDateString()}
          </p>
          <p className="text-lg font-semibold">
            Amount: {formatCurrency(displayAmount)}
          </p>
          <p className={`text-sm ${statusColors[displayStatus]}`}>
            Status: {displayStatus?.toUpperCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleCard;
