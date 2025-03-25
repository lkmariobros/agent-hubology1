
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Banknote 
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Get status style
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
      case 'Under Review':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        };
      case 'Approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        };
      case 'Ready for Payment':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: <Banknote className="h-3.5 w-3.5 mr-1" />
        };
      case 'Paid':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        };
      case 'Rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
    }
  };
  
  const { bg, text, icon } = getStatusStyle(status);
  
  return (
    <Badge 
      variant="outline" 
      className={`${bg} ${text} flex items-center ${className}`}
    >
      {icon}
      {status}
    </Badge>
  );
};

export default StatusBadge;
