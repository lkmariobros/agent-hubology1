
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PropertyAgentNotes: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Agent Notes</h3>
      <p className="text-sm text-muted-foreground">
        Add private notes about this property. These will only be visible to agents, not to clients.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="agentNotes">Notes</Label>
        <Textarea
          id="agentNotes"
          value={formData.agentNotes || ''}
          onChange={(e) => updateFormData({ agentNotes: e.target.value })}
          placeholder="Add internal notes about this property (viewing instructions, contact preferences, etc.)"
          className="min-h-32"
        />
      </div>
    </div>
  );
};

export default PropertyAgentNotes;
