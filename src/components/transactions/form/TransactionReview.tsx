
import React from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { 
  Calendar, 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  Clock,
  CheckSquare,
  XSquare
} from 'lucide-react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';

const TransactionReview: React.FC = () => {
  const { state, calculateCommission } = useTransactionForm();
  const { formData, documents } = state;
  
  const commissionBreakdown = calculateCommission();
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Get client names based on transaction type
  const getClientNames = () => {
    switch (formData.transactionType) {
      case 'Sale':
        return {
          party1: formData.buyer?.name || 'Not provided',
          party1Label: 'Buyer',
          party2: formData.seller?.name || 'Not provided',
          party2Label: 'Seller'
        };
      case 'Rent':
        return {
          party1: formData.tenant?.name || 'Not provided',
          party1Label: 'Tenant',
          party2: formData.landlord?.name || 'Not provided',
          party2Label: 'Landlord'
        };
      case 'Primary':
        return {
          party1: formData.buyer?.name || 'Not provided',
          party1Label: 'Buyer',
          party2: formData.developer?.name || 'Not provided',
          party2Label: 'Developer'
        };
      default:
        return {
          party1: 'Not provided',
          party1Label: 'Party 1',
          party2: 'Not provided',
          party2Label: 'Party 2'
        };
    }
  };
  
  const clients = getClientNames();
  
  // Get transaction summary items
  const getSummaryItems = () => {
    return [
      {
        icon: <Clock className="h-5 w-5" />,
        label: 'Transaction Status',
        value: formData.status
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: 'Transaction Date',
        value: formatDate(formData.transactionDate)
      },
      {
        icon: <Home className="h-5 w-5" />,
        label: 'Property',
        value: formData.property ? formData.property.title : 'Not selected'
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: clients.party1Label,
        value: clients.party1
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: clients.party2Label,
        value: clients.party2
      },
      {
        icon: <DollarSign className="h-5 w-5" />,
        label: 'Transaction Value',
        value: formatCurrency(formData.transactionValue)
      },
      {
        icon: <DollarSign className="h-5 w-5" />,
        label: 'Commission Rate',
        value: `${formData.commissionRate}%`
      },
      {
        icon: <DollarSign className="h-5 w-5" />,
        label: 'Total Commission',
        value: formatCurrency(commissionBreakdown.totalCommission)
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: 'Documents',
        value: `${documents.length} attached`
      },
      {
        icon: formData.coBroking.enabled ? <CheckSquare className="h-5 w-5" /> : <XSquare className="h-5 w-5" />,
        label: 'Co-Broking',
        value: formData.coBroking.enabled 
          ? `Enabled (${formData.coBroking.agentName}, ${formData.coBroking.commissionSplit}% split)`
          : 'Disabled'
      }
    ];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Review Transaction</h2>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {formData.transactionType} Transaction
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Please review all transaction details before submission. You can go back to any previous step to make changes.
      </p>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {getSummaryItems().map((item, index) => (
              <div key={index} className="flex items-center space-x-3 py-2 border-b">
                <div className="text-muted-foreground">{item.icon}</div>
                <div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          
          {formData.notes && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
              <p className="text-muted-foreground whitespace-pre-line">{formData.notes}</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Commission Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Agency Share (30%)</div>
                  <div className="text-lg font-bold">{formatCurrency(commissionBreakdown.agencyShare)}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500/10">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Your Share</div>
                  <div className="text-lg font-bold">{formatCurrency(commissionBreakdown.agentShare)}</div>
                </CardContent>
              </Card>
              
              {formData.coBroking.enabled && commissionBreakdown.coAgentShare !== undefined && (
                <Card className="bg-blue-500/10">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Co-Agent Share</div>
                    <div className="text-lg font-bold">{formatCurrency(commissionBreakdown.coAgentShare)}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Document list */}
      {documents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Attached Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium truncate max-w-[200px]">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.documentType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <p className="text-sm text-muted-foreground">
          By submitting this transaction, you confirm that all the information provided is accurate and complete.
          Once submitted, the transaction will be sent for approval according to the company's transaction workflow.
        </p>
      </div>
    </div>
  );
};

export default TransactionReview;
