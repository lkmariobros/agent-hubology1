
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useCommissionApprovals,
  useSystemConfiguration
} from '@/hooks/useCommissionApproval';
import { formatCurrency } from '@/utils/propertyUtils';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import SummaryCards from './SummaryCards';
import StatusBadge from './StatusBadge';
import BulkApprovalTools from './BulkApprovalTools';

const ApprovalDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { data: thresholdConfig } = useSystemConfiguration('commission_approval_threshold');
  const threshold = thresholdConfig ? parseFloat(thresholdConfig) : 10000;
  
  const { data, isLoading, refetch } = useCommissionApprovals(
    activeTab === 'all' ? undefined : activeTab,
    isAdmin,
    user?.id,
    currentPage,
    pageSize
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Commission Approvals</h1>
        <p className="text-muted-foreground">
          Manage and review commission approval requests
        </p>
      </div>
      
      <SummaryCards />
      
      <Tabs defaultValue="pending" className="space-y-6" onValueChange={tab => {
        setActiveTab(tab === 'all' ? 'all' : tab);
        setCurrentPage(1);
      }}>
        <div className="flex justify-between items-end">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="Under Review">Under Review</TabsTrigger>
            <TabsTrigger value="Approved">Approved</TabsTrigger>
            <TabsTrigger value="Ready for Payment">Ready for Payment</TabsTrigger>
            <TabsTrigger value="Paid">Paid</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-6">
          <ApprovalsList 
            approvals={data?.approvals} 
            isLoading={isLoading} 
            threshold={threshold} 
          />
        </TabsContent>
        
        <TabsContent value="Pending" className="space-y-6">
          {isAdmin && (
            <BulkApprovalTools onComplete={() => refetch()} />
          )}
          <ApprovalsList 
            approvals={data?.approvals} 
            isLoading={isLoading} 
            threshold={threshold} 
          />
        </TabsContent>
        
        <TabsContent value="Under Review" className="space-y-6">
          <ApprovalsList 
            approvals={data?.approvals} 
            isLoading={isLoading} 
            threshold={threshold} 
          />
        </TabsContent>
        
        <TabsContent value="Approved" className="space-y-6">
          <ApprovalsList 
            approvals={data?.approvals} 
            isLoading={isLoading} 
            threshold={threshold} 
          />
        </TabsContent>
        
        <TabsContent value="Ready for Payment" className="space-y-6">
          <ApprovalsList 
            approvals={data?.approvals} 
            isLoading={isLoading} 
            threshold={threshold} 
          />
        </TabsContent>
        
        <TabsContent value="Paid" className="space-y-6">
          <ApprovalsList 
            approvals={data?.approvals} 
            isLoading={isLoading} 
            threshold={threshold} 
          />
        </TabsContent>
      </Tabs>
      
      {data && data.approvals.length > 0 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!data || data.approvals.length < pageSize}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

interface ApprovalsListProps {
  approvals?: any[];
  isLoading: boolean;
  threshold: number;
}

const ApprovalsList: React.FC<ApprovalsListProps> = ({ approvals, isLoading, threshold }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!approvals || approvals.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h2 className="text-lg font-medium">No approvals found</h2>
            <p className="text-muted-foreground">
              There are no commission approvals with the selected status.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Commission Approvals</CardTitle>
        <CardDescription>
          Review and manage commission approval requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <StatusBadge status={approval.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {formatDate(approval.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(approval.property_transactions.commission_amount)}
                  </div>
                </TableCell>
                <TableCell>
                  {approval.threshold_exceeded ? (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span>Exceeds</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Within</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/admin/commissions/${approval.id}`}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApprovalDashboard;
