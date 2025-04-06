
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdditionalDetailsTab: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="agentNotes">Agent Notes</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Add private notes about this property (only visible to agents)
        </p>
        <Textarea
          id="agentNotes"
          value={formData.agentNotes || ''}
          onChange={(e) => updateFormData({ agentNotes: e.target.value })}
          placeholder="Enter any additional notes or observations about this property"
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default AdditionalDetailsTab;
