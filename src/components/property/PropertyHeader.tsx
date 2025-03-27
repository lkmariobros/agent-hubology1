
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Home, Building } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from 'react-router-dom';

interface PropertyHeaderProps {
  title: string;
  isAdmin: boolean;
  propertyType?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ 
  title, 
  isAdmin,
  propertyType = 'Property',
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}>
              <Home size={16} className="mr-1" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/properties" onClick={(e) => {
              e.preventDefault();
              navigate('/properties');
            }}>
              <Building size={16} className="mr-1" />
              Properties
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1" onClick={onEdit}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {isAdmin && (
            <Button variant="destructive" className="flex items-center gap-1" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
