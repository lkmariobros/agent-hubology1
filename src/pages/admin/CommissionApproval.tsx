
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import ApprovalDashboard from '@/components/admin/commission/ApprovalDashboard';
import ApprovalDetail from '@/components/admin/commission/ApprovalDetail';

const CommissionApproval = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        {id ? (
          // Updated to match the component's prop name
          <ApprovalDetail id={id} />
        ) : (
          <ApprovalDashboard />
        )}
      </div>
    </AdminLayout>
  );
};

export default CommissionApproval;
