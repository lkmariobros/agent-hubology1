
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Banknote,
  ArrowLeftRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ApprovalActionsProps {
  currentStatus: string;
  onUpdateStatus: (newStatus: string, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

const ApprovalActions: React.FC<ApprovalActionsProps> = ({ 
  currentStatus, 
  onUpdateStatus,
  isLoading = false
}) => {
  const [actionType, setActionType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogAction = async () => {
    if (!actionType) return;
    
    let newStatus = '';
    switch (actionType) {
      case 'approve':
        newStatus = 'Approved';
        break;
      case 'reject':
        newStatus = 'Rejected';
        break;
      case 'review':
        newStatus = 'Under Review';
        break;
      case 'ready-for-payment':
        newStatus = 'Ready for Payment';
        break;
      case 'paid':
        newStatus = 'Paid';
        break;
    }
    
    try {
      await onUpdateStatus(newStatus, notes);
      setIsOpen(false);
      setNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleOpenDialog = (type: string) => {
    setActionType(type);
    setIsOpen(true);
  };

  const getActionButtons = () => {
    switch (currentStatus) {
      case 'Pending':
        return (
          <>
            <Button 
              variant="outline"
              onClick={() => handleOpenDialog('review')}
              className="gap-2"
              disabled={isLoading}
            >
              <AlertTriangle className="h-4 w-4" />
              Start Review
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="default"
                onClick={() => handleOpenDialog('approve')}
                className="gap-2"
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleOpenDialog('reject')}
                className="gap-2"
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </>
        );
        
      case 'Under Review':
        return (
          <div className="flex gap-2">
            <Button 
              variant="default"
              onClick={() => handleOpenDialog('approve')}
              className="gap-2"
              disabled={isLoading}
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleOpenDialog('reject')}
              className="gap-2"
              disabled={isLoading}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        );
        
      case 'Approved':
        return (
          <div className="flex gap-2">
            <Button 
              variant="default"
              onClick={() => handleOpenDialog('ready-for-payment')}
              className="gap-2"
              disabled={isLoading}
            >
              <Banknote className="h-4 w-4" />
              Ready for Payment
            </Button>
            <Button 
              variant="secondary"
              onClick={() => handleOpenDialog('review')}
              className="gap-2"
              disabled={isLoading}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Back to Review
            </Button>
          </div>
        );
        
      case 'Ready for Payment':
        return (
          <Button 
            variant="default"
            onClick={() => handleOpenDialog('paid')}
            className="gap-2"
            disabled={isLoading}
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as Paid
          </Button>
        );
        
      case 'Paid':
        return (
          <div className="text-sm text-muted-foreground">
            This commission has been paid. No further actions available.
          </div>
        );
        
      case 'Rejected':
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => handleOpenDialog('review')}
              className="gap-2"
              disabled={isLoading}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Reopen for Review
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    switch (actionType) {
      case 'approve':
        return 'Approve Commission';
      case 'reject':
        return 'Reject Commission';
      case 'review':
        return currentStatus === 'Rejected' ? 'Reopen for Review' : 'Start Review';
      case 'ready-for-payment':
        return 'Mark as Ready for Payment';
      case 'paid':
        return 'Mark as Paid';
      default:
        return 'Update Status';
    }
  };

  const getDialogDescription = () => {
    switch (actionType) {
      case 'approve':
        return 'Are you sure you want to approve this commission? This will allow it to proceed to payment processing.';
      case 'reject':
        return 'Are you sure you want to reject this commission? This will stop the approval process.';
      case 'review':
        return currentStatus === 'Rejected' 
          ? 'Are you sure you want to reopen this commission for review?' 
          : 'Are you sure you want to mark this commission as under review?';
      case 'ready-for-payment':
        return 'Are you sure you want to mark this commission as ready for payment?';
      case 'paid':
        return 'Are you sure you want to mark this commission as paid? This action cannot be undone.';
      default:
        return 'Please confirm you want to update the status of this commission.';
    }
  };

  const getActionButtonLabel = () => {
    switch (actionType) {
      case 'approve':
        return 'Approve';
      case 'reject':
        return 'Reject';
      case 'review':
        return currentStatus === 'Rejected' ? 'Reopen' : 'Start Review';
      case 'ready-for-payment':
        return 'Ready for Payment';
      case 'paid':
        return 'Mark as Paid';
      default:
        return 'Confirm';
    }
  };

  return (
    <div className="flex justify-between items-center">
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      ) : (
        getActionButtons()
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label htmlFor="notes" className="text-sm font-medium mb-2 block">
              Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={handleDialogAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                getActionButtonLabel()
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalActions;
