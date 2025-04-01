
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ApprovalHistoryItem } from '@/hooks/useCommissionApproval';

interface ApprovalHistoryProps {
  history: ApprovalHistoryItem[];
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No history available for this approval.</p>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    Status changed from <span className="font-semibold">{item.old_status || item.previous_status}</span> to <span className="font-semibold">{item.new_status}</span>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  By {item.changed_by_name || 'Unknown'} on {formatDate(item.created_at)}
                </p>
                {item.notes && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm">{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApprovalHistory;
