
export type NotificationType = 
  | 'approval' 
  | 'payment' 
  | 'system' 
  | 'message' 
  | 'approval_status_change'
  | 'tier_update'
  | 'commission_milestone';

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
