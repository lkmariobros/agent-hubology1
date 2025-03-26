
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  rank?: string;
  tier?: string;
  phone?: string;
  properties?: number;
  transactions?: number;
  points?: number;
  sales?: number;
}
