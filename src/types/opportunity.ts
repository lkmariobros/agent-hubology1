
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  status: 'Urgent' | 'New' | 'Featured' | 'Active';
  propertyType: string;
  postedBy: string;
  postedDate: string;
  expiryDate?: string;
  priority?: number;
  requirements?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}
