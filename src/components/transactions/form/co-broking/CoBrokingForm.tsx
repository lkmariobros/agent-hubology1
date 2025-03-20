
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { CoBrokingInfo } from '@/types/transaction-form';
import CommissionSplitSelector from './CommissionSplitSelector';

interface CoBrokingFormProps {
  coBroking: CoBrokingInfo;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string | number | boolean) => void;
}

const CoBrokingForm: React.FC<CoBrokingFormProps> = ({
  coBroking,
  errors,
  onFieldChange
}) => {
  const [isCredentialsVerified, setIsCredentialsVerified] = React.useState(
    coBroking?.credentialsVerified || false
  );

  const handleCredentialsVerified = (checked: boolean) => {
    setIsCredentialsVerified(checked);
    onFieldChange('credentialsVerified', checked);
  };

  const handleSplitChange = (value: number) => {
    onFieldChange('commissionSplit', value);
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="agentName">
            Co-Agent Name
          </Label>
          <Input
            id="agentName"
            value={coBroking?.agentName || ''}
            onChange={(e) => onFieldChange('agentName', e.target.value)}
            placeholder="Enter co-broker agent name"
            className={errors?.coAgentName ? 'border-destructive' : ''}
          />
          {errors?.coAgentName && (
            <p className="text-sm text-destructive mt-1">{errors.coAgentName}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="agentCompany">
            Co-Agent Company
          </Label>
          <Input
            id="agentCompany"
            value={coBroking?.agentCompany || ''}
            onChange={(e) => onFieldChange('agentCompany', e.target.value)}
            placeholder="Enter co-broker company name"
            className={errors?.coAgentCompany ? 'border-destructive' : ''}
          />
          {errors?.coAgentCompany && (
            <p className="text-sm text-destructive mt-1">{errors.coAgentCompany}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="agentContact">
            Co-Agent Contact
          </Label>
          <Input
            id="agentContact"
            value={coBroking?.agentContact || ''}
            onChange={(e) => onFieldChange('agentContact', e.target.value)}
            placeholder="Enter co-broker contact information"
          />
        </div>
        
        <CommissionSplitSelector 
          value={coBroking?.commissionSplit || 50}
          onChange={handleSplitChange}
        />
        
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified" 
              checked={isCredentialsVerified}
              onCheckedChange={handleCredentialsVerified}
            />
            <Label htmlFor="verified" className="text-sm">
              I confirm that I have verified the co-broker's license and credentials
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoBrokingForm;
