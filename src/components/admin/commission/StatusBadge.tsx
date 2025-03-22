
import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Banknote, Ban, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status,
  className = '',
  size = 'md'
}) => {
  // Get status badge style - updated to use our theme colors
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'status-badge-amber';
      case 'Under Review':
        return 'status-badge-blue';
      case 'Approved':
        return 'status-badge-green';
      case 'Ready for Payment':
        return 'bg-purple-100 text-purple-800';
      case 'Paid':
        return 'bg-gray-100 text-gray-800';
      case 'Rejected':
        return 'status-badge-red';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending':
        return <Clock className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'Under Review':
        return <AlertTriangle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'Approved':
        return <CheckCircle2 className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'Ready for Payment':
        return <Banknote className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'Paid':
        return <CheckCircle2 className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'Rejected':
        return <Ban className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      default:
        return <HelpCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
    }
  };
  
  const sizeClass = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass[size]} ${getStatusBadgeClass(status)} ${className}`}>
      {getStatusIcon(status)}
      <span className={`ml-${size === 'sm' ? '0.5' : '1'}`}>{status}</span>
    </span>
  );
};

export default StatusBadge;
