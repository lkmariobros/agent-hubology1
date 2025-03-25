
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Banknote, 
  CheckCheck,
  XCircle
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Define icon and styling based on status
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          icon: Clock,
          variant: 'outline',
          className: 'border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30'
        };
      case 'under review':
        return {
          icon: AlertCircle,
          variant: 'outline',
          className: 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/30'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          variant: 'outline',
          className: 'border-green-500 text-green-500 bg-green-50 dark:bg-green-950/30'
        };
      case 'ready for payment':
        return {
          icon: Banknote,
          variant: 'outline',
          className: 'border-purple-500 text-purple-500 bg-purple-50 dark:bg-purple-950/30'
        };
      case 'paid':
        return {
          icon: CheckCheck,
          variant: 'outline',
          className: 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
        };
      case 'rejected':
        return {
          icon: XCircle,
          variant: 'outline',
          className: 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/30'
        };
      default:
        return {
          icon: Clock,
          variant: 'outline',
          className: 'border-gray-500 text-gray-500'
        };
    }
  };
  
  const { icon: Icon, className } = getStatusConfig(status);
  
  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  );
};

export default StatusBadge;
