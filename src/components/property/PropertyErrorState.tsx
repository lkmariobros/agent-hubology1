
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyErrorStateProps {
  title: string;
  message: string;
}

const PropertyErrorState: React.FC<PropertyErrorStateProps> = ({ title, message }) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button onClick={() => navigate('/properties')}>
        Return to Properties
      </Button>
    </div>
  );
};

export default PropertyErrorState;
