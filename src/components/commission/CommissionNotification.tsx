
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CommissionNotificationProps {
  status: string;
  commissionAmount: number;
  date?: string;
}

const CommissionNotification: React.FC<CommissionNotificationProps> = ({ 
  status, 
  commissionAmount,
  date 
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getNotificationContent = () => {
    switch(status) {
      case 'Pending':
        return {
          icon: <Info className="h-4 w-4" />,
          variant: 'default',
          title: 'Commission Pending Approval',
          description: `Your commission of ${formatCurrency(commissionAmount)} has been submitted for approval.${date ? ` Submitted on ${formatDate(date)}.` : ''}`
        };
      case 'Under Review':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: 'default',
          title: 'Commission Under Review',
          description: `Your commission of ${formatCurrency(commissionAmount)} is currently under review.${date ? ` Last updated on ${formatDate(date)}.` : ''}`
        };
      case 'Approved':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'success',
          title: 'Commission Approved',
          description: `Your commission of ${formatCurrency(commissionAmount)} has been approved.${date ? ` Approved on ${formatDate(date)}.` : ''}`
        };
      case 'Ready for Payment':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'success',
          title: 'Commission Ready for Payment',
          description: `Your commission of ${formatCurrency(commissionAmount)} is ready for payment.${date ? ` Payment processing started on ${formatDate(date)}.` : ''}`
        };
      case 'Paid':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'success',
          title: 'Commission Paid',
          description: `Your commission of ${formatCurrency(commissionAmount)} has been paid.${date ? ` Paid on ${formatDate(date)}.` : ''}`
        };
      case 'Rejected':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: 'destructive',
          title: 'Commission Rejected',
          description: `Your commission of ${formatCurrency(commissionAmount)} has been rejected.${date ? ` Rejected on ${formatDate(date)}.` : ''} Please contact your administrator for more information.`
        };
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          variant: 'default',
          title: 'Commission Status',
          description: `Your commission of ${formatCurrency(commissionAmount)} is being processed.`
        };
    }
  };
  
  const content = getNotificationContent();
  
  return (
    <Alert variant={content.variant as any}>
      <div className="flex items-center">
        {content.icon}
        <AlertTitle className="ml-2">{content.title}</AlertTitle>
      </div>
      <AlertDescription>{content.description}</AlertDescription>
    </Alert>
  );
};

export default CommissionNotification;
