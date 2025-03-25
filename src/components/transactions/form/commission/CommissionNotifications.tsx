
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSystemConfiguration } from '@/hooks/useCommissionApproval';
import { Bell, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CommissionNotificationsProps {
  commissionAmount: number;
  isSubmitting?: boolean;
}

const CommissionNotifications: React.FC<CommissionNotificationsProps> = ({ 
  commissionAmount,
  isSubmitting 
}) => {
  const navigate = useNavigate();
  const { data: thresholdConfig, isLoading } = useSystemConfiguration('commission_approval_threshold');
  
  if (isLoading || isSubmitting) return null;
  
  const threshold = thresholdConfig ? parseFloat(thresholdConfig) : 10000;
  const exceedsThreshold = commissionAmount > threshold;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  return (
    <Card className={`${exceedsThreshold ? 'border-amber-200 bg-amber-50/30' : 'border-green-200 bg-green-50/30'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-2 ${exceedsThreshold ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {exceedsThreshold ? (
              <Clock className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-base font-semibold ${exceedsThreshold ? 'text-amber-800' : 'text-green-800'}`}>
              {exceedsThreshold 
                ? 'Additional Approval Required' 
                : 'Standard Approval Process'}
            </h3>
            
            <p className={`text-sm mt-1 ${exceedsThreshold ? 'text-amber-700' : 'text-green-700'}`}>
              {exceedsThreshold
                ? `This commission amount (${formatCurrency(commissionAmount)}) exceeds the ${formatCurrency(threshold)} threshold and will require additional verification.`
                : `This commission will follow the standard approval process.`
              }
            </p>
            
            <div className="mt-3 flex items-center">
              <Bell className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                You'll be notified about the approval status changes.
              </span>
            </div>
            
            <Button 
              variant="link" 
              className={`p-0 mt-2 ${exceedsThreshold ? 'text-amber-700' : 'text-green-700'}`}
              onClick={() => navigate('/transactions')}
            >
              View your approvals
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionNotifications;
