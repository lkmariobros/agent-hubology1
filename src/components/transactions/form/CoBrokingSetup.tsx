
import React, { useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import CoBrokingForm from './co-broking/CoBrokingForm';
import CoBrokingDisabledCard from './co-broking/CoBrokingDisabledCard';

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
          commissionSplit: 50,
          credentialsVerified: false
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
    commissionSplit: 50,
    credentialsVerified: false
  };
  
  const handleCoBrokingToggle = (enabled: boolean) => {
    updateFormData({
      coBroking: {
        ...coBroking,
        enabled
      }
    });
  };
  
  const handleCoBrokingChange = (field: string, value: string | number | boolean) => {
    updateFormData({
      coBroking: {
        ...coBroking,
        [field]: value
      }
    });
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
      
      {coBroking?.enabled ? (
        <CoBrokingForm 
          coBroking={coBroking}
          errors={errors}
          onFieldChange={handleCoBrokingChange}
        />
      ) : (
        <CoBrokingDisabledCard />
      )}
    </div>
  );
};

export default CoBrokingSetup;
