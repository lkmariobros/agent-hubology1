
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import SummaryCards from '@/components/admin/commission/SummaryCards';
import StatusBadge from '@/components/admin/commission/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  useApprovalStatusCounts,
  usePendingCommissionTotal,
  useApprovedCommissionTotal,
  useCommissionApprovals,
  ApprovalStatus
} from '@/hooks/useCommissionApproval';
import { formatCurrency } from '@/utils/propertyUtils';
import { Link } from 'react-router-dom';
import TestEdgeFunctionButton from './TestEdgeFunctionButton';

interface DashboardSummary {
  label: string;
  value: string;
  description: string;
}

const ApprovalDashboard = () => {
  const { data: statusCounts, isLoading: isLoadingCounts } = useApprovalStatusCounts();
  const { data: pendingTotal, isLoading: isLoadingPending } = usePendingCommissionTotal();
  const { data: approvedTotal, isLoading: isLoadingApproved } = useApprovedCommissionTotal();
  const [activeTab, setActiveTab] = React.useState<ApprovalStatus | 'All'>('Pending');
  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  
  const { data: approvalsData, isLoading: isLoadingApprovals } = useCommissionApprovals(
    activeTab,
    true, // isAdmin
    undefined,
    page,
    pageSize
  );
  
  const approvals = approvalsData?.approvals || [];
  const totalCount = approvalsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Handle tab change with proper type conversion
  const handleTabChange = (value: string) => {
    setActiveTab(value as ApprovalStatus | 'All');
  };
  
  const summaryCardsData: DashboardSummary[] = [
    {
      label: 'Pending Approvals',
      value: isLoadingCounts ? 'Loading...' : statusCounts?.pending.toString() || '0',
      description: 'Number of commission approvals awaiting review'
    },
    {
      label: 'Under Review',
      value: isLoadingCounts ? 'Loading...' : statusCounts?.under_review.toString() || '0',
      description: 'Commission approvals currently under review'
    },
    {
      label: 'Approved',
      value: isLoadingCounts ? 'Loading...' : statusCounts?.approved.toString() || '0',
      description: 'Commission approvals that have been approved'
    },
    {
      label: 'Ready for Payment',
      value: isLoadingCounts ? 'Loading...' : statusCounts?.ready_for_payment.toString() || '0',
      description: 'Commission approvals ready for payment processing'
    },
    {
      label: 'Paid',
      value: isLoadingCounts ? 'Loading...' : statusCounts?.paid.toString() || '0',
      description: 'Commission approvals that have been paid out'
    },
    {
      label: 'Rejected',
      value: isLoadingCounts ? 'Loading...' : statusCounts?.rejected.toString() || '0',
      description: 'Commission approvals that have been rejected'
    },
    {
      label: 'Total Pending Commission',
      value: isLoadingPending ? 'Loading...' : formatCurrency(pendingTotal || 0),
      description: 'Total value of commissions awaiting approval'
    },
    {
      label: 'Total Approved Commission',
      value: isLoadingApproved ? 'Loading...' : formatCurrency(approvedTotal || 0),
      description: 'Total value of commissions that have been approved'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commission Approval Dashboard</h1>
          <p className="text-muted-foreground">Manage and track commission approval requests</p>
        </div>
        
        <div className="flex items-center gap-2">
          <TestEdgeFunctionButton />
        </div>
      </div>
      
      <SummaryCards summaryData={summaryCardsData} />
      
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
          <CardDescription>
            View and manage commission approval requests by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Pending" className="space-y-4" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Under Review">Under Review</TabsTrigger>
              <TabsTrigger value="Approved">Approved</TabsTrigger>
              <TabsTrigger value="Ready for Payment">Ready for Payment</TabsTrigger>
              <TabsTrigger value="Paid">Paid</TabsTrigger>
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="Pending">
              <ApprovalList 
                approvals={approvals} 
                isLoading={isLoadingApprovals}
              />
            </TabsContent>
            <TabsContent value="Under Review">
              <ApprovalList 
                approvals={approvals} 
                isLoading={isLoadingApprovals}
              />
            </TabsContent>
            <TabsContent value="Approved">
              <ApprovalList 
                approvals={approvals} 
                isLoading={isLoadingApprovals}
              />
            </TabsContent>
            <TabsContent value="Ready for Payment">
              <ApprovalList 
                approvals={approvals} 
                isLoading={isLoadingApprovals}
              />
            </TabsContent>
            <TabsContent value="Paid">
              <ApprovalList 
                approvals={approvals} 
                isLoading={isLoadingApprovals}
              />
            </TabsContent>
            <TabsContent value="Rejected">
              <ApprovalList 
                approvals={approvals} 
                isLoading={isLoadingApprovals}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ApprovalListProps {
  approvals: any[];
  isLoading: boolean;
}

const ApprovalList: React.FC<ApprovalListProps> = ({ approvals, isLoading }) => {
  if (isLoading) {
    return <p>Loading approvals...</p>;
  }
  
  if (!approvals || approvals.length === 0) {
    return <p>No approvals found for this status.</p>;
  }
  
  return (
    <div className="divide-y divide-border">
      {approvals.map((approval) => (
        <div key={approval.id} className="py-4 flex items-center justify-between">
          <div>
            <Link to={`/admin/commission-approvals/${approval.id}`} className="font-medium hover:underline">
              Transaction #{approval.transaction_id?.slice(0, 8)}
            </Link>
            <p className="text-sm text-muted-foreground">
              Submitted by {approval.agent?.name || 'Unknown'} on {new Date(approval.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={approval.status} />
        </div>
      ))}
    </div>
  );
};

export default ApprovalDashboard;
