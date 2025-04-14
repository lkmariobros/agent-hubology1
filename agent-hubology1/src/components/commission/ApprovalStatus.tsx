
import React from 'react';
import StatusBadge from '@/components/admin/commission/StatusBadge';

interface ApprovalStatusProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ status, size = 'md' }) => {
  return <StatusBadge status={status} size={size} />;
};

export default ApprovalStatus;
