
import React from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface TransactionReviewProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const TransactionReview: React.FC<TransactionReviewProps> = ({ onSubmit, isSubmitting }) => {
  const { state, prevStep } = useTransactionForm();
  const { formData } = state;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Transaction</h2>
      <p className="text-muted-foreground">
        Review the transaction details before submission.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
            <p><strong>Type:</strong> {formData.transactionType}</p>
            <p><strong>Value:</strong> ${formData.transactionValue.toLocaleString()}</p>
            <p><strong>Commission:</strong> ${formData.commissionAmount.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Transaction'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TransactionReview;
