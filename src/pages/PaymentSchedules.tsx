import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';

const PaymentSchedules = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <p>Welcome, {user.name}! This page will display your payment schedules.</p>
          ) : (
            <p>Please sign in to view your payment schedules.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSchedules;
