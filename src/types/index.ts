
export * from './property';
export * from './transaction-form';

export interface DashboardMetric {
  label: string;
  value: string;
  percentChange?: number;
  timeframe?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
