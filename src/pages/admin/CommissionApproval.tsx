
import React from 'react';
import { useParams } from 'react-router-dom';
import ApprovalDashboard from '@/components/admin/commission/ApprovalDashboard';
import ApprovalDetail from '@/components/admin/commission/ApprovalDetail';

const CommissionApproval = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto">
      {id ? (
        <ApprovalDetail id={id} />
      ) : (
        <ApprovalDashboard />
      )}
    </div>
  );
};

export default CommissionApproval;
