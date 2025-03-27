
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface PropertyHeaderProps {
  title: string;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ 
  title, 
  isAdmin, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
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
  );
};

export default PropertyHeader;
