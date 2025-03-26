
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCommissionNotifications } from '@/hooks/useCommissionNotifications';

const SendTestNotification: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    createApprovalStatusNotification,
    createTierProgressNotification,
    createTierAchievedNotification,
    createCommissionMilestoneNotification
  } = useCommissionNotifications();
  
  const sendApprovalNotification = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive"
      });
      return;
    }
    
    const statuses = ["pending", "under review", "approved", "ready for payment", "paid", "rejected"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 50000) + 5000;
    
    createApprovalStatusNotification(user.id, status, amount, `tx-${Date.now()}`, `ap-${Date.now()}`);
  };
  
  const sendTierProgressNotification = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive"
      });
      return;
    }
    
    const progress = Math.floor(Math.random() * 95) + 5;
    createTierProgressNotification(user.id, progress);
  };
  
  const sendTierAchievedNotification = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive"
      });
      return;
    }
    
    const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    
    createTierAchievedNotification(user.id, tier);
  };
  
  const sendMilestoneNotification = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive"
      });
      return;
    }
    
    const milestones = [50000, 100000, 250000, 500000, 1000000];
    const milestone = milestones[Math.floor(Math.random() * milestones.length)];
    
    createCommissionMilestoneNotification(user.id, milestone);
  };
  
  if (!user) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
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
  );
};

export default SendTestNotification;
