
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  status: string;
  propertyType: string;
  postedBy: string;
  postedDate: string;
  // Additional fields
  deadline?: string;
  requirements?: string[];
  assignedTo?: string;
  notes?: string;
}
