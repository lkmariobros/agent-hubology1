
export type NotificationType = 
  | 'approval' 
  | 'payment' 
  | 'system' 
  | 'message' 
  | 'approval_status' 
  | 'approval_status_change'
  | 'tier_progress' 
  | 'tier_achieved'
  | 'tier_update'
  | 'commission_milestone'
  | 'transaction_status';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}
