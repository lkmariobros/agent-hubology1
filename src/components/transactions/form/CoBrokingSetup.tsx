
import React, { useCallback, useMemo } from 'react';
import { useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ErrorBoundary } from 'react-error-boundary';
import { CoBrokingInfo } from '@/types/transaction-form';
import CoBrokingForm from './co-broking/CoBrokingForm';
import CoBrokingDisabledCard from './co-broking/CoBrokingDisabledCard';

// Define proper type for the error fallback component
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Fallback component if there's an error in the co-broking section
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="p-4 border border-destructive rounded-md">
    <h3 className="text-lg font-semibold text-destructive">Something went wrong in the co-broking section</h3>
    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-white rounded-md"
    >
      Reset
    </button>
  </div>
);

const CoBrokingSetup: React.FC = () => {
  const { state, updateFormData } = useClerkTransactionForm();
  const { formData, errors } = state;
  
  console.log('CoBrokingSetup rendered with formData:', formData);
  
  // Safely access coBroking data with default values as fallback
  const coBroking = useMemo(() => formData.coBroking || {
    enabled: false,
    agentName: '',
    agentCompany: '',
    agentContact: '',
    commissionSplit: 50,
    credentialsVerified: false
  }, [formData.coBroking]);
  
  // Memoized callbacks to prevent unnecessary re-renders
  const handleCoBrokingToggle = useCallback((enabled: boolean) => {
    console.log('CoBroking toggle:', enabled);
    
    // Create a properly structured coBroking object
    const updatedCoBroking = {
      ...coBroking,
      enabled
    };
    
    console.log('Updating coBroking with:', updatedCoBroking);
    updateFormData({ coBroking: updatedCoBroking });
  }, [coBroking, updateFormData]);
  
  const handleCoBrokingChange = useCallback((field: string, value: string | number | boolean) => {
    console.log('CoBroking field change:', field, value);
    
    // Create a properly structured coBroking object with the updated field
    const updatedCoBroking = {
      ...coBroking,
      [field]: value
    };
    
    console.log('Updating coBroking with:', updatedCoBroking);
    updateFormData({ coBroking: updatedCoBroking });
  }, [coBroking, updateFormData]);

  // Reset error boundary when toggling co-broking
  const handleErrorReset = useCallback(() => {
    console.log('Resetting co-broking form due to error');
    // Reset to default state
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
  }, [updateFormData]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Co-Broking Setup</h2>
      <p className="text-muted-foreground">
        If this transaction involves a co-broker, enable co-broking and provide their details.
      </p>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="coBroking" 
          checked={coBroking.enabled || false}
          onCheckedChange={handleCoBrokingToggle}
        />
        <Label htmlFor="coBroking" className="font-medium">
          Enable Co-Broking
        </Label>
      </div>
      
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
        {coBroking.enabled ? (
          <CoBrokingForm 
            coBroking={coBroking as CoBrokingInfo}
            errors={errors}
            onFieldChange={handleCoBrokingChange}
          />
        ) : (
          <CoBrokingDisabledCard />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CoBrokingSetup;
