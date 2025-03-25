
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CoBrokingInfo } from '@/types/transaction-form';

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
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="agentName">Co-broker Agent Name</Label>
            <Input
              id="agentName"
              value={coBroking.agentName || ''}
              onChange={(e) => onFieldChange('agentName', e.target.value)}
              placeholder="Enter co-broker agent name"
              className={errors.coAgentName ? 'border-destructive' : ''}
            />
            {errors.coAgentName && (
              <p className="text-sm text-destructive mt-1">{errors.coAgentName}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="agentCompany">Co-broker Company</Label>
            <Input
              id="agentCompany"
              value={coBroking.agentCompany || ''}
              onChange={(e) => onFieldChange('agentCompany', e.target.value)}
              placeholder="Enter co-broker company name"
              className={errors.coAgentCompany ? 'border-destructive' : ''}
            />
            {errors.coAgentCompany && (
              <p className="text-sm text-destructive mt-1">{errors.coAgentCompany}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="agentContact">Co-broker Contact Information</Label>
            <Input
              id="agentContact"
              value={coBroking.agentContact || ''}
              onChange={(e) => onFieldChange('agentContact', e.target.value)}
              placeholder="Enter contact information (phone, email)"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="commissionSplit">Commission Split</Label>
              <span className="text-sm">
                Our Agency: {coBroking.commissionSplit}% | Co-broker: {100 - (coBroking.commissionSplit || 0)}%
              </span>
            </div>
            <Slider
              id="commissionSplit"
              value={[coBroking.commissionSplit || 50]}
              onValueChange={(values) => onFieldChange('commissionSplit', values[0])}
              min={0}
              max={100}
              step={5}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-8">
            <Switch 
              id="credentialsVerified" 
              checked={!!coBroking.credentialsVerified}
              onCheckedChange={(checked) => onFieldChange('credentialsVerified', checked)}
            />
            <Label htmlFor="credentialsVerified">Co-broker credentials verified</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoBrokingForm;
