
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PropertyAgentNotes: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Agent Notes</h3>
      
      <Alert variant="default" className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          These notes are for internal use only and will not be visible to clients.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="agentNotes">Internal Notes</Label>
        <Textarea
          id="agentNotes"
          value={formData.agentNotes || ''}
          onChange={(e) => updateFormData({ agentNotes: e.target.value })}
          placeholder="Add any private notes about this property (e.g., seller motivation, negotiation strategies, etc.)"
          className="min-h-32"
        />
      </div>
    </div>
  );
};

export default PropertyAgentNotes;
