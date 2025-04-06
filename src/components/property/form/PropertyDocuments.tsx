
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import PropertyDocumentsUpload from './PropertyDocumentsUpload';
import PropertyAgentNotes from './PropertyAgentNotes';

const PropertyDocuments: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          <PropertyDocumentsUpload />
          <PropertyAgentNotes />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDocuments;
