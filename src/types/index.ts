
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
  avatar?: string;
  sales?: number;
  points?: number;
}

export interface CommissionTier {
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
}
