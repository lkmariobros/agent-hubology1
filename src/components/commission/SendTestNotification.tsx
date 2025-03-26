
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCommissionNotifications } from '@/hooks/useCommissionNotifications';
import NotificationDebugger from './NotificationDebugger';

const SendTestNotification: React.FC = () => {
  const { user } = useAuth();
  const {
    createApprovalStatusNotification,
    createTierProgressNotification,
    createTierAchievedNotification,
    createCommissionMilestoneNotification
  } = useCommissionNotifications();
  
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
      </div>
      
      <NotificationDebugger />
    </div>
  );
};

export default SendTestNotification;
