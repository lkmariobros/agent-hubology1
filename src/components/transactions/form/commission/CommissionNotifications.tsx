
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface CommissionNotificationsProps {
  commissionAmount: number;
  isSubmitting: boolean;
}

const CommissionNotifications: React.FC<CommissionNotificationsProps> = ({
  commissionAmount,
  isSubmitting
}) => {
  // For demonstration purposes only
  const getNotificationContent = () => {
    // Mock check based on commission amount
    if (commissionAmount > 50000) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        title: 'High Commission Alert',
        message: 'This commission exceeds the typical range for this transaction type. Please verify all details before submission.'
      };
    } else if (commissionAmount > 10000) {
      return {
        icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
        title: 'Commission Information',
        message: 'This commission is within expected range and will be processed according to standard procedures.'
      };
    } else {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: 'Normal Commission Range',
        message: 'This commission is within the normal range for this transaction type.'
      };
    }
  };

  const notification = getNotificationContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="default" className="border-l-4" style={{ borderLeftColor: notification.icon.props.className.includes('amber') ? '#f59e0b' : notification.icon.props.className.includes('blue') ? '#3b82f6' : '#10b981' }}>
          <div className="flex items-start gap-3">
            {notification.icon}
            <div>
              <h4 className="font-medium mb-1">{notification.title}</h4>
              <AlertDescription>
                {notification.message}
              </AlertDescription>
            </div>
          </div>
        </Alert>
        {isSubmitting && (
          <div className="mt-3 p-2 bg-primary-50 text-primary-700 rounded-md text-sm">
            Your transaction is being processed...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionNotifications;
