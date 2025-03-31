
import React from 'react';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import LoadingIndicator from '@/components/ui/loading-indicator';

interface ApprovalHistoryProps {
  approvalId: string;
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({
  approvalId
}) => {
  const commissionApprovalHooks = useCommissionApproval();
  const { data: approvalHistory, isLoading } = commissionApprovalHooks.useCommissionApprovalHistory(approvalId);
  
  if (isLoading) {
    return <LoadingIndicator text="Loading history..." />;
  }
  
  if (!approvalHistory || approvalHistory.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No history records available.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Status History</h3>
      
      <div className="space-y-2">
        {approvalHistory.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
            <div>
              <span className="font-medium">{item.new_status}</span>
              <span className="text-xs text-muted-foreground ml-2">by {item.changed_by_name || 'System'}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalHistory;
