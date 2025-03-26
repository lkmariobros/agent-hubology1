
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCommissionNotifications } from '@/hooks/useCommissionNotifications';
import NotificationDebugger from './NotificationDebugger';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertTriangle } from 'lucide-react';

const SendTestNotification: React.FC = () => {
  const { user } = useAuth();
  const [showDebugger, setShowDebugger] = useState(false);
  const [usageWarning, setUsageWarning] = useState<boolean>(false);
  const {
    createApprovalStatusNotification,
    createTierProgressNotification,
    createTierAchievedNotification,
    createCommissionMilestoneNotification
  } = useCommissionNotifications();
  
  // Check localStorage for edge function usage
  React.useEffect(() => {
    const usageCount = localStorage.getItem('edge_function_usage_count');
    if (usageCount && parseInt(usageCount, 10) > 350) {
      setUsageWarning(true);
    }
  }, []);
  
  const sendApprovalNotification = () => {
    if (!user?.id) {
      return;
    }
    
    const statuses = ["pending", "under review", "approved", "ready for payment", "paid", "rejected"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 50000) + 5000;
    
    createApprovalStatusNotification(user.id, status, amount, `tx-${Date.now()}`, `ap-${Date.now()}`);
  };
  
  const sendTierProgressNotification = () => {
    if (!user?.id) {
      return;
    }
    
    const progress = Math.floor(Math.random() * 95) + 5;
    createTierProgressNotification(user.id, progress);
  };
  
  const sendTierAchievedNotification = () => {
    if (!user?.id) {
      return;
    }
    
    const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    
    createTierAchievedNotification(user.id, tier);
  };
  
  const sendMilestoneNotification = () => {
    if (!user?.id) {
      return;
    }
    
    const milestones = [50000, 100000, 250000, 500000, 1000000];
    const milestone = milestones[Math.floor(Math.random() * milestones.length)];
    
    createCommissionMilestoneNotification(user.id, milestone);
  };
  
  if (!user) return null;
  
  return (
    <div className="space-y-4 mt-4">
      {usageWarning && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Edge function usage is high. Low-priority notifications will use local fallback to reduce edge function invocations.
          </AlertDescription>
        </Alert>
      )}
      
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Use these tools to test notification functionality. For detailed debugging, use the advanced debugger below.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={sendApprovalNotification}>
          Test Approval Notification
        </Button>
        <Button variant="outline" size="sm" onClick={sendTierProgressNotification}>
          Test Tier Progress
        </Button>
        <Button variant="outline" size="sm" onClick={sendTierAchievedNotification}>
          Test Tier Achievement
        </Button>
        <Button variant="outline" size="sm" onClick={sendMilestoneNotification}>
          Test Milestone
        </Button>
        <Button 
          variant={showDebugger ? "default" : "secondary"} 
          size="sm" 
          onClick={() => setShowDebugger(!showDebugger)}
        >
          {showDebugger ? "Hide Debugger" : "Show Advanced Debugger"}
        </Button>
      </div>
      
      {showDebugger && <NotificationDebugger />}
    </div>
  );
};

export default SendTestNotification;
