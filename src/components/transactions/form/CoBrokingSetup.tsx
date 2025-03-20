
import React, { useCallback, useMemo, useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ErrorBoundary } from 'react-error-boundary';
import CoBrokingForm from './co-broking/CoBrokingForm';
import CoBrokingDisabledCard from './co-broking/CoBrokingDisabledCard';

// Fallback component if there's an error in the co-broking section
const ErrorFallback = ({ error, resetErrorBoundary }) => (
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

const CoBrokingSetup = () => {
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
  
  // Safely access coBroking data with memoization to prevent unnecessary recalculations
  const coBroking = useMemo(() => formData.coBroking || {
    enabled: false,
    agentName: '',
    agentCompany: '',
    agentContact: '',
    commissionSplit: 50,
    credentialsVerified: false
  }, [formData.coBroking]);
  
  // Memoized callbacks to prevent unnecessary re-renders
  const handleCoBrokingToggle = useCallback((enabled) => {
    updateFormData({
      coBroking: {
        ...coBroking,
        enabled
      }
    });
  }, [coBroking, updateFormData]);
  
  const handleCoBrokingChange = useCallback((field, value) => {
    updateFormData({
      coBroking: {
        ...coBroking,
        [field]: value
      }
    });
  }, [coBroking, updateFormData]);

  // Reset error boundary when toggling co-broking
  const handleErrorReset = useCallback(() => {
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
          checked={coBroking?.enabled || false}
          onCheckedChange={handleCoBrokingToggle}
        />
        <Label htmlFor="coBroking" className="font-medium">
          Enable Co-Broking
        </Label>
      </div>
      
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
        {coBroking?.enabled ? (
          <CoBrokingForm 
            coBroking={coBroking}
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
