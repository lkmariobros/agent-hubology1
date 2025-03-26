
import React from 'react';
import { AlertCircle, CheckCircle, Info, Award, TrendingUp, DollarSign } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type CommissionNotificationType = 
  | 'approval_pending'
  | 'approval_review'
  | 'approval_approved'
  | 'approval_ready'
  | 'approval_paid'
  | 'approval_rejected'
  | 'tier_progress'
  | 'tier_achieved'
  | 'commission_milestone';

interface CommissionNotificationProps {
  type: CommissionNotificationType;
  title?: string;
  message?: string;
  commissionAmount?: number;
  tierName?: string;
  progressPercentage?: number;
  date?: string;
  compact?: boolean;
}

const CommissionNotification: React.FC<CommissionNotificationProps> = ({ 
  type,
  title,
  message,
  commissionAmount = 0,
  tierName,
  progressPercentage,
  date,
  compact = false
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
    // Default values which may be overridden if custom title/message provided
    let defaultTitle = '';
    let defaultMessage = '';
    let icon = <Info className="h-4 w-4" />;
    let variant: 'default' | 'destructive' | 'success' = 'default';

    switch(type) {
      case 'approval_pending':
        icon = <Info className="h-4 w-4" />;
        variant = 'default';
        defaultTitle = 'Commission Pending Approval';
        defaultMessage = `Your commission of ${formatCurrency(commissionAmount)} has been submitted for approval.${date ? ` Submitted on ${formatDate(date)}.` : ''}`;
        break;
        
      case 'approval_review':
        icon = <AlertCircle className="h-4 w-4" />;
        variant = 'default';
        defaultTitle = 'Commission Under Review';
        defaultMessage = `Your commission of ${formatCurrency(commissionAmount)} is currently under review.${date ? ` Last updated on ${formatDate(date)}.` : ''}`;
        break;
        
      case 'approval_approved':
        icon = <CheckCircle className="h-4 w-4" />;
        variant = 'success';
        defaultTitle = 'Commission Approved';
        defaultMessage = `Your commission of ${formatCurrency(commissionAmount)} has been approved.${date ? ` Approved on ${formatDate(date)}.` : ''}`;
        break;
        
      case 'approval_ready':
        icon = <DollarSign className="h-4 w-4" />;
        variant = 'success';
        defaultTitle = 'Commission Ready for Payment';
        defaultMessage = `Your commission of ${formatCurrency(commissionAmount)} is ready for payment.${date ? ` Payment processing started on ${formatDate(date)}.` : ''}`;
        break;
        
      case 'approval_paid':
        icon = <CheckCircle className="h-4 w-4" />;
        variant = 'success';
        defaultTitle = 'Commission Paid';
        defaultMessage = `Your commission of ${formatCurrency(commissionAmount)} has been paid.${date ? ` Paid on ${formatDate(date)}.` : ''}`;
        break;
        
      case 'approval_rejected':
        icon = <AlertCircle className="h-4 w-4" />;
        variant = 'destructive';
        defaultTitle = 'Commission Rejected';
        defaultMessage = `Your commission of ${formatCurrency(commissionAmount)} has been rejected.${date ? ` Rejected on ${formatDate(date)}.` : ''} Please contact your administrator for more information.`;
        break;
        
      case 'tier_progress':
        icon = <TrendingUp className="h-4 w-4" />;
        variant = 'default';
        defaultTitle = 'Tier Progress Update';
        defaultMessage = `You're ${progressPercentage}% of the way to the next tier. Keep up the great work!`;
        break;
        
      case 'tier_achieved':
        icon = <Award className="h-4 w-4" />;
        variant = 'success';
        defaultTitle = 'New Tier Achieved!';
        defaultMessage = `Congratulations! You've reached the ${tierName} tier. Your commission rate has been updated.`;
        break;
        
      case 'commission_milestone':
        icon = <Award className="h-4 w-4" />;
        variant = 'success';
        defaultTitle = 'Commission Milestone Reached';
        defaultMessage = `You've reached ${formatCurrency(commissionAmount)} in commissions! Keep up the excellent work.`;
        break;
        
      default:
        icon = <Info className="h-4 w-4" />;
        variant = 'default';
        defaultTitle = 'Commission Update';
        defaultMessage = `You have a new update regarding your commission.`;
    }

    return {
      icon,
      variant,
      title: title || defaultTitle,
      message: message || defaultMessage
    };
  };
  
  const content = getNotificationContent();

  if (compact) {
    return (
      <div className="flex items-start p-2">
        <div className="mr-2 mt-0.5">{content.icon}</div>
        <div>
          <p className="text-sm font-medium">{content.title}</p>
          <p className="text-xs text-muted-foreground">{content.message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <Alert variant={content.variant as any} className="border-l-4">
      <div className="flex items-center">
        {content.icon}
        <AlertTitle className="ml-2">{content.title}</AlertTitle>
      </div>
      <AlertDescription>{content.message}</AlertDescription>
    </Alert>
  );
};

export default CommissionNotification;
