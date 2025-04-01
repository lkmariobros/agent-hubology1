
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedulesManagement } from '@/components/admin/commission/PaymentSchedulesManagement';

const PaymentSchedulesAdmin = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Payment Schedules Management</h1>
      <PaymentSchedulesManagement />
    </div>
  );
};

export default PaymentSchedulesAdmin;
