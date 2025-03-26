
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle, DollarSign, HelpCircle } from 'lucide-react';

interface ApprovalStatusProps {
  status: string;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ status }) => {
  // Determine which badge to show based on status
  const getBadgeContent = () => {
    switch (status) {
      case 'Pending':
        return {
          color: 'bg-amber-500 hover:bg-amber-600',
          icon: <Clock className="h-3 w-3 mr-1" />,
          text: 'Pending'
        };
      case 'Under Review':
        return {
          color: 'bg-blue-500 hover:bg-blue-600',
          icon: <HelpCircle className="h-3 w-3 mr-1" />,
          text: 'Under Review'
        };
      case 'Approved':
        return {
          color: 'bg-green-500 hover:bg-green-600',
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
          text: 'Approved'
        };
      case 'Ready for Payment':
        return {
          color: 'bg-purple-500 hover:bg-purple-600',
          icon: <DollarSign className="h-3 w-3 mr-1" />,
          text: 'Ready for Payment'
        };
      case 'Paid':
        return {
          color: 'bg-green-700 hover:bg-green-800',
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
          text: 'Paid'
        };
      case 'Rejected':
        return {
          color: 'bg-red-500 hover:bg-red-600',
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          text: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-500 hover:bg-gray-600',
          icon: <HelpCircle className="h-3 w-3 mr-1" />,
          text: status || 'Unknown'
        };
    }
  };
  
  const { color, icon, text } = getBadgeContent();
  
  return (
    <Badge className={color}>
      {icon}
      {text}
    </Badge>
  );
};

export default ApprovalStatus;
