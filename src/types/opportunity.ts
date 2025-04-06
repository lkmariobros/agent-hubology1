
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  status: string;
  postedBy: string;
  postedDate: string;
  propertyType?: string;
}
