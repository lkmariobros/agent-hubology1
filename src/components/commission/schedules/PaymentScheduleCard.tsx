import React from 'react';
// Update the import
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

interface PaymentScheduleCardProps {
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
}

const PaymentScheduleCard: React.FC<PaymentScheduleCardProps> = ({ date, amount, status }) => {
  const { user } = useAuth();
  
  const statusColors = {
    pending: 'text-yellow-500',
    paid: 'text-green-500',
    failed: 'text-red-500',
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Date: {new Date(date).toLocaleDateString()}
          </p>
          <p className="text-lg font-semibold">
            Amount: {formatCurrency(amount)}
          </p>
          <p className={`text-sm ${statusColors[status]}`}>
            Status: {status.toUpperCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleCard;
