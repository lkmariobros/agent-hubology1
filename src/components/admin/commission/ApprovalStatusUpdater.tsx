
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCommissionApproval, { CommissionApproval } from '@/hooks/useCommissionApproval';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { toast } from 'sonner';

interface ApprovalStatusUpdaterProps {
  approval: CommissionApproval;
  onStatusUpdate: () => void;
}

const ApprovalStatusUpdater: React.FC<ApprovalStatusUpdaterProps> = ({
  approval,
  onStatusUpdate
}) => {
  const [status, setStatus] = useState<string>(approval.status || 'Pending');
  const { useUpdateApprovalStatusMutation } = useCommissionApproval();
  const { mutateAsync: updateApprovalStatus, isPending: isUpdating } = useUpdateApprovalStatusMutation();
  
  const handleUpdateStatus = async () => {
    try {
      await updateApprovalStatus({
        approvalId: approval.id,
        newStatus: status
      });
      toast.success(`Status updated to ${status}`);
      onStatusUpdate();
    } catch (error) {
      console.error('Failed to update approval status:', error);
      toast.error('Failed to update status');
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-medium">Update Status</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Select 
          value={status} 
          onValueChange={setStatus}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Ready for Payment">Ready for Payment</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleUpdateStatus} 
          disabled={isUpdating || status === approval.status}
          className="w-full sm:w-auto"
        >
          {isUpdating ? (
            <LoadingIndicator size="sm" variant="inline" text="Updating..." />
          ) : (
            'Update Status'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApprovalStatusUpdater;
