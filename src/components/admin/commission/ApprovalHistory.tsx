
import React from 'react';
import { useCommissionApproval } from '@/hooks/useCommissionApproval';
import LoadingIndicator from '@/components/ui/loading-indicator';

interface ApprovalHistoryProps {
  approvalId: string;
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({
  approvalId
}) => {
  const { history, isLoadingHistory } = useCommissionApproval();
  
  if (isLoadingHistory) {
    return <LoadingIndicator text="Loading history..." />;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Status History</h3>
      
      {history && history.length > 0 ? (
        <div className="space-y-2">
          {history.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
              <div>
                <span className="font-medium">{item.status}</span>
                <span className="text-xs text-muted-foreground ml-2">by {item.updated_by_name || 'System'}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.updated_at).toLocaleString()}
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
