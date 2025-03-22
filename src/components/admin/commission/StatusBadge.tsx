
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
  // Get status badge style - matching the reference design
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-amber-500 text-white';
      case 'Under Review':
        return 'bg-blue-500 text-white';
      case 'Approved':
        return 'bg-emerald-500 text-white';
      case 'Ready for Payment':
        return 'bg-purple-500 text-white';
      case 'Paid':
        return 'bg-gray-600 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      case 'Active':
        return 'bg-emerald-500 text-white';
      case 'Inactive':
        return 'bg-[rgba(255,255,255,0.15)] text-white';
      default:
        return 'bg-[rgba(255,255,255,0.15)] text-white';
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
      case 'Active':
        return <CheckCircle2 className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'Inactive':
        return <Ban className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      default:
        return <HelpCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
    }
  };
  
  const sizeClass = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-1.5'
  };
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-semibold shadow-sm", 
      sizeClass[size], 
      getStatusBadgeClass(status), 
      className
    )}>
      {getStatusIcon(status)}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
