
import React from 'react';
import { PaymentSchedulesManagement } from '@/components/admin/commission/PaymentSchedulesManagement';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from '@/components/ui/loading-indicator';

const PaymentSchedulesAdmin = () => {
  const { isAdmin, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <LoadingIndicator size="lg" text="Verifying authentication..." />;
  }
  
  // If user is not admin, redirect to admin dashboard instead of agent dashboard
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Payment Schedules Management</h1>
      
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertTitle>Access Control Information</AlertTitle>
        <AlertDescription>
          This page is protected by Row Level Security. Only users with admin privileges can modify payment schedules.
        </AlertDescription>
      </Alert>
      
      <PaymentSchedulesManagement />
    </div>
  );
};

export default PaymentSchedulesAdmin;
