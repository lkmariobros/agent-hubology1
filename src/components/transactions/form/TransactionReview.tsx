import React, { useState } from 'react';
import { useTransactionForm } from '@/context/TransactionForm'; // Updated import path
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  FileCheck, 
  Loader2,
  DollarSign,
  Building,
  Calendar,
  User,
  Users,
  FileText,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ApprovalStatus from '@/components/commission/ApprovalStatus';

const TransactionReview: React.FC = () => {
  const { 
    state, 
    prevStep, 
    submitForm,
    saveForm,
    calculateCommission
  } = useTransactionForm();
  
  const { formData, documents } = state;
  
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Prepare commission data for display
  const commissionBreakdown = calculateCommission();
  
  // Get property type label
  const getPropertyTypeLabel = () => {
    const { property } = formData;
    return property?.type || 'Not specified';
  };
  
  // Get transaction parties based on transaction type
  const getTransactionParties = () => {
    const { transactionType, buyer, seller, landlord, tenant, developer } = formData;
    
    if (transactionType === 'Sale') {
      return { 
        party1: { label: 'Buyer', data: buyer },
        party2: { label: 'Seller', data: seller }
      };
    } else if (transactionType === 'Rent') {
      return {
        party1: { label: 'Tenant', data: tenant },
        party2: { label: 'Landlord', data: landlord }
      };
    } else {
      return {
        party1: { label: 'Buyer', data: buyer },
        party2: { label: 'Developer', data: developer }
      };
    }
  };
  
  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not specified';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateStr || 'Not specified';
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle save draft
  const handleSaveDraft = async () => {
    setSaving(true);
    await saveForm();
    setSaving(false);
  };
  
  // Handle submit
  const handleSubmit = async () => {
    setSubmitting(true);
    await submitForm();
    setSubmitting(false);
  };
  
  // Get transaction parties
  const parties = getTransactionParties();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Transaction</h2>
      <p className="text-muted-foreground">
        Review the transaction details before submission.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                  Transaction Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-1">Transaction Type</p>
                  <p>{formData.transactionType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Transaction Date</p>
                  <p>{formatDate(formData.transactionDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <p>{formData.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Closing Date</p>
                  <p>{formatDate(formData.closingDate)}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Property Information */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Building className="mr-2 h-5 w-5 text-muted-foreground" />
                  Property Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-1">Property</p>
                  <p>{formData.property?.title || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Property Type</p>
                  <p>{getPropertyTypeLabel()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Address</p>
                  <p>{formData.property?.address || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Transaction Value</p>
                  <p>{formatCurrency(formData.transactionValue)}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Client Information */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  Client Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-1">{parties.party1.label}</p>
                  <p>{parties.party1.data?.name || 'Not specified'}</p>
                  {parties.party1.data?.email && <p className="text-sm text-muted-foreground">{parties.party1.data.email}</p>}
                  {parties.party1.data?.phone && <p className="text-sm text-muted-foreground">{parties.party1.data.phone}</p>}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{parties.party2.label}</p>
                  <p>{parties.party2.data?.name || 'Not specified'}</p>
                  {parties.party2.data?.email && <p className="text-sm text-muted-foreground">{parties.party2.data.email}</p>}
                  {parties.party2.data?.phone && <p className="text-sm text-muted-foreground">{parties.party2.data.phone}</p>}
                </div>
              </div>
              
              {formData.coBroking?.enabled && (
                <>
                  <Separator className="my-4" />
                  
                  {/* Co-Broking Information */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="mr-2 h-5 w-5 text-muted-foreground" />
                      Co-Broker Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium mb-1">Agent Name</p>
                      <p>{formData.coBroking.agentName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Agent Company</p>
                      <p>{formData.coBroking.agentCompany || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Contact Information</p>
                      <p>{formData.coBroking.agentContact || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Commission Split</p>
                      <p>{formData.coBroking.commissionSplit}% / {100 - (formData.coBroking.commissionSplit || 0)}%</p>
                    </div>
                  </div>
                </>
              )}
              
              <Separator className="my-4" />
              
              {/* Commission Information */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                  Commission Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-1">Commission Rate</p>
                  <p className="flex items-center">
                    {formData.commissionRate}%
                    <Percent className="h-4 w-4 ml-1 text-muted-foreground" />
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Commission Amount</p>
                  <p>{formatCurrency(commissionBreakdown.totalCommission)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Agent Tier</p>
                  <p>{formData.agentTier || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Agent Share</p>
                  <p>{formatCurrency(commissionBreakdown.agentShare)}</p>
                </div>
              </div>
              
              {documents.length > 0 && (
                <>
                  <Separator className="my-4" />
                  
                  {/* Documents */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                      Documents
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="bg-muted/30 p-3 rounded flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {formData.notes && (
                <>
                  <Separator className="my-4" />
                  
                  {/* Notes */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Additional Notes</h3>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="text-sm whitespace-pre-line">{formData.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Approval Status (if transaction has an ID, meaning it's saved) */}
          {formData.id && (
            <ApprovalStatus transactionId={formData.id} />
          )}
        </div>
        
        <div className="space-y-6">
          {/* Commission Breakdown */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                  Commission Summary
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm">Transaction Value</span>
                  <span className="font-medium">{formatCurrency(formData.transactionValue)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm">Commission Rate</span>
                  <span className="font-medium">{formData.commissionRate}%</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm">Total Commission</span>
                  <span className="font-medium">{formatCurrency(commissionBreakdown.totalCommission)}</span>
                </div>
                
                {formData.coBroking?.enabled && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">Our Agency Portion ({formData.coBroking.commissionSplit}%)</span>
                      <span className="font-medium">{formatCurrency(commissionBreakdown.ourAgencyCommission || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">Co-Broker Portion ({100 - (formData.coBroking.commissionSplit || 0)}%)</span>
                      <span className="font-medium">{formatCurrency(commissionBreakdown.coAgencyCommission || 0)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm">Agency Share</span>
                  <span className="font-medium">{formatCurrency(commissionBreakdown.agencyShare)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm">Agent Share</span>
                  <span className="font-medium">{formatCurrency(commissionBreakdown.agentShare)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Transaction Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                  Transaction Actions
                </h3>
              </div>
              
              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit Transaction
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default TransactionReview;
