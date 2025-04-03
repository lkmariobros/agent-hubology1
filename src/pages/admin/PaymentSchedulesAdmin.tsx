
import React from 'react';
import { PaymentSchedulesManagement } from '@/components/admin/commission/PaymentSchedulesManagement';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PaymentSchedulesAdmin = () => {
  const { user } = useAuth();
  
  // Check if user is admin (tier >= 4 for now, should be using proper role system)
  const isAdmin = user?.tier >= 4;
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Payment Schedules Management</h1>
      
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertTitle>Access Control Information</AlertTitle>
        <AlertDescription>
          This page is protected by Row Level Security. Only users with admin privileges (tier 4+) can modify payment schedules.
        </AlertDescription>
      </Alert>
      
      <PaymentSchedulesManagement />
    </div>
  );
};

export default PaymentSchedulesAdmin;
