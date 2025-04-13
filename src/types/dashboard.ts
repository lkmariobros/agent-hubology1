import { ReactNode } from 'react';

// Dashboard metric data structure
export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}

// Commission data structure
export interface CommissionData {
  total: number;
  change: number;
}

// Leaderboard position data
export interface LeaderboardPosition {
  position: number | string;
  change: number;
  hasTransactions: boolean;
}
