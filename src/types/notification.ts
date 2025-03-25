
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'commission' | 'property' | 'system' | 'message';
  read: boolean;
  createdAt: string;
  relatedId?: string;
  data?: Record<string, any>;
}
