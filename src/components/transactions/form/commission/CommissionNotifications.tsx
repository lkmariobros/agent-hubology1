
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <CardTitle>Commission Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            {notification.icon}
          </div>
          <div>
            <h4 className="font-medium mb-1">{notification.title}</h4>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            
            {isSubmitting && (
              <p className="mt-2 text-sm italic">
                Your transaction is being submitted. Notifications will be sent when the commission is approved.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionNotifications;
