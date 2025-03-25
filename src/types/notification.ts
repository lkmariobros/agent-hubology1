
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type?: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  link?: string;
  linkText?: string;
}
