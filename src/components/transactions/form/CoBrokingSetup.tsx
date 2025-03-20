
import React, { useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

const CoBrokingSetup: React.FC = () => {
  const { state, updateFormData } = useTransactionForm();
  const { formData, errors } = state;
  
  // Initialize coBroking if it doesn't exist
  useEffect(() => {
    if (!formData.coBroking) {
      updateFormData({
        coBroking: {
          enabled: false,
          agentName: '',
          agentCompany: '',
          agentContact: '',
          commissionSplit: 50
        }
      });
    }
  }, [formData.coBroking, updateFormData]);
  
  // Safely access coBroking data with fallbacks to prevent null/undefined errors
  const coBroking = formData.coBroking || {
    enabled: false,
    agentName: '',
    agentCompany: '',
    agentContact: '',
    commissionSplit: 50
  };
  
  const handleCoBrokingToggle = (enabled: boolean) => {
    updateFormData({
      coBroking: {
        ...coBroking,
        enabled
      }
    });
  };
  
  const handleCoBrokingChange = (field: string, value: string | number) => {
    updateFormData({
      coBroking: {
        ...coBroking,
        [field]: value
      }
    });
  };
  
  // Handle commission split change from tabs
  const handleCommissionSplitChange = (value: string) => {
    const splitValue = parseInt(value);
    if (!isNaN(splitValue)) {
      handleCoBrokingChange('commissionSplit', splitValue);
    }
  };
  
  // Default split value (used for tabs)
  const splitValue = coBroking?.commissionSplit?.toString() || "50";
  
  // Validate credentials checkbox state
  const [isCredentialsVerified, setIsCredentialsVerified] = React.useState(false);
  const handleCredentialsVerified = (checked: boolean) => {
    setIsCredentialsVerified(checked);
    
    // If co-broking is enabled, also update this in the form data
    if (coBroking?.enabled) {
      updateFormData({
        coBroking: {
          ...coBroking,
          credentialsVerified: checked
        }
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Co-Broking Setup</h2>
      <p className="text-muted-foreground">
        If this transaction involves a co-broker, enable co-broking and provide their details.
      </p>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="coBroking" 
          checked={coBroking?.enabled || false}
          onCheckedChange={handleCoBrokingToggle}
        />
        <Label htmlFor="coBroking" className="font-medium">
          Enable Co-Broking
        </Label>
      </div>
      
      {coBroking?.enabled && (
        <Card className="mt-4">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="agentName">
                Co-Agent Name
              </Label>
              <Input
                id="agentName"
                value={coBroking?.agentName || ''}
                onChange={(e) => handleCoBrokingChange('agentName', e.target.value)}
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
                onChange={(e) => handleCoBrokingChange('agentCompany', e.target.value)}
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
                onChange={(e) => handleCoBrokingChange('agentContact', e.target.value)}
                placeholder="Enter co-broker contact information"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionSplit">
                Commission Split (%)
              </Label>
              <Tabs 
                defaultValue="50" 
                value={splitValue}
                onValueChange={handleCommissionSplitChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="10">10%</TabsTrigger>
                  <TabsTrigger value="25">25%</TabsTrigger>
                  <TabsTrigger value="50">50%</TabsTrigger>
                  <TabsTrigger value="75">75%</TabsTrigger>
                  <TabsTrigger value="90">90%</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <Input
                    id="commissionSplit"
                    type="number"
                    min="1"
                    max="99"
                    value={coBroking?.commissionSplit || 50}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handleCoBrokingChange('commissionSplit', value);
                      }
                    }}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    The co-broker will receive {coBroking?.commissionSplit || 50}% of the agent's commission.
                  </p>
                </div>
              </Tabs>
            </div>
            
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
      )}
      
      {!coBroking?.enabled && (
        <Card className="mt-4 bg-muted/30">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No co-broking for this transaction. All commission will be allocated according to the standard commission structure.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoBrokingSetup;
