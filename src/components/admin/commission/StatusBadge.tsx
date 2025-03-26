
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Banknote 
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
      case 'under review':
        return {
          color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
          icon: <AlertTriangle className="h-4 w-4 mr-1" />
        };
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 hover:bg-green-200',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      case 'ready for payment':
        return {
          color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
          icon: <Banknote className="h-4 w-4 mr-1" />
        };
      case 'paid':
        return {
          color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 hover:bg-red-200',
          icon: <XCircle className="h-4 w-4 mr-1" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
    }
  };
  
  const { color, icon } = getStatusConfig(status);
  
  return (
    <Badge className={`flex items-center ${color}`}>
      {icon}
      <span>{status}</span>
    </Badge>
  );
};

export default StatusBadge;
