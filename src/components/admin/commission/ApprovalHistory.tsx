
import React from 'react';
import useCommissionApproval, { ApprovalHistoryItem } from '@/hooks/useCommissionApproval';
import LoadingIndicator from '@/components/ui/loading-indicator';

interface ApprovalHistoryProps {
  approvalId: string;
  history?: ApprovalHistoryItem[];
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({
  approvalId,
  history
}) => {
  const { useCommissionApprovalDetail } = useCommissionApproval();
  const { data, isLoading: isLoadingHistory } = useCommissionApprovalDetail(approvalId);
  
  // If history is provided as a prop, use it; otherwise, use data from the hook
  const historyItems = history || data?.history || [];
  
  if (isLoadingHistory && !history) {
    return <LoadingIndicator text="Loading history..." />;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Status History</h3>
      
      {historyItems.length > 0 ? (
        <div className="space-y-2">
          {historyItems.map((item, index) => (
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
      ) : (
        <p className="text-center text-muted-foreground py-4">No history available</p>
      )}
    </div>
  );
};

export default ApprovalHistory;
