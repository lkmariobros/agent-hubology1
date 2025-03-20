
import React, { useCallback, useState, useMemo, useEffect } from 'react';
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
  // Local state to reduce parent re-renders
  const [isCredentialsVerified, setIsCredentialsVerified] = useState(
    coBroking?.credentialsVerified || false
  );

  // Update local state when props change
  useEffect(() => {
    setIsCredentialsVerified(coBroking?.credentialsVerified || false);
  }, [coBroking?.credentialsVerified]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCredentialsVerified = useCallback((checked: boolean) => {
    setIsCredentialsVerified(checked);
    onFieldChange('credentialsVerified', checked);
  }, [onFieldChange]);

  const handleSplitChange = useCallback((value: number) => {
    onFieldChange('commissionSplit', value);
  }, [onFieldChange]);

  const handleTextChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(field, e.target.value);
  }, [onFieldChange]);

  // Memoize error messages to prevent unnecessary re-renders
  const nameError = useMemo(() => errors?.coAgentName, [errors?.coAgentName]);
  const companyError = useMemo(() => errors?.coAgentCompany, [errors?.coAgentCompany]);

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
            onChange={handleTextChange('agentName')}
            placeholder="Enter co-broker agent name"
            className={nameError ? 'border-destructive' : ''}
          />
          {nameError && (
            <p className="text-sm text-destructive mt-1">{nameError}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="agentCompany">
            Co-Agent Company
          </Label>
          <Input
            id="agentCompany"
            value={coBroking?.agentCompany || ''}
            onChange={handleTextChange('agentCompany')}
            placeholder="Enter co-broker company name"
            className={companyError ? 'border-destructive' : ''}
          />
          {companyError && (
            <p className="text-sm text-destructive mt-1">{companyError}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="agentContact">
            Co-Agent Contact
          </Label>
          <Input
            id="agentContact"
            value={coBroking?.agentContact || ''}
            onChange={handleTextChange('agentContact')}
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

// Use React.memo to prevent unnecessary re-renders
export default React.memo(CoBrokingForm);
