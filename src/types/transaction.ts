
export interface Transaction {
  id: string;
  date: string;
  propertyId: string;
  property?: {
    title: string;
  };
  commission: number;
  status: string;
}
