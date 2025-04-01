
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useCommissionApproval from '@/hooks/useCommissionApproval';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import LoadingIndicator from '@/components/ui/loading-indicator';
import ApprovalHistory from '@/components/admin/commission/ApprovalHistory';
import ApprovalStatusUpdater from './ApprovalStatusUpdater';
import SummaryCards from './SummaryCards';
import CommentsSection from './CommentsSection';

const ApprovalDetail: React.FC<{ id: string }> = ({ id }) => {
  const { isAdmin } = useAuth();
  const commissionApprovalHooks = useCommissionApproval();
  const { data: approvalData, isLoading, error } = commissionApprovalHooks.useCommissionApprovalDetail(id);
  
  if (isLoading) {
    return <LoadingIndicator text="Loading approval details..." />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle>Error Loading Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-300">{error.message}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!approvalData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested approval could not be found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Approval Details</h1>
      </div>
      
      <SummaryCards approval={approvalData} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isAdmin && (
              <ApprovalStatusUpdater 
                approvalId={id} 
                currentStatus={approvalData.status} 
              />
            )}
            <div className="mt-6">
              <ApprovalHistory approvalId={id} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentsSection approvalId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApprovalDetail;
