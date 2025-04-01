
import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Banknote, 
  Ban, 
  HelpCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  // Get status badge style
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Ready for Payment':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'Paid':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
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
    sm: 'px-1.5 py-0.5 text-xs gap-0.5',
    md: 'px-2.5 py-1 text-xs gap-1',
    lg: 'px-3 py-1.5 text-sm gap-1.5'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass[size]} ${getStatusBadgeClass(status)} ${className}`}>
      {getStatusIcon(status)}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
