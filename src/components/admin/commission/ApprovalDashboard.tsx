
import React, { useState } from 'react';
import { useCommissionApprovals } from '@/hooks/useCommissionApproval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Banknote,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from './SummaryCards';

type StatusTab = 'all' | 'pending' | 'under-review' | 'approved' | 'ready-for-payment' | 'paid';

const ApprovalDashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<StatusTab>('pending');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map status tab to actual database status
  const getStatusFromTab = (tab: StatusTab): string | undefined => {
    if (tab === 'all') return undefined;
    return tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get approvals based on selected tab
  const { data, isLoading, error } = useCommissionApprovals(
    getStatusFromTab(currentTab),
    true, // isAdmin
    undefined, // userId not needed for admin
    page,
    10
  );
  
  const totalPages = data ? Math.ceil(data.totalCount / 10) : 0;
  
  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge style
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Ready for Payment':
        return 'bg-purple-100 text-purple-800';
      case 'Paid':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Under Review':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Ready for Payment':
        return <Banknote className="h-4 w-4" />;
      case 'Paid':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Commission Approval Dashboard</h1>
          <p className="text-muted-foreground">
            Manage commission approvals and process payments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search approvals..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Summary metrics */}
      <SummaryCards />
      
      {/* Status tabs */}
      <Tabs 
        defaultValue="pending" 
        value={currentTab} 
        onValueChange={(value) => {
          setCurrentTab(value as StatusTab);
          setPage(1);
        }}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="under-review">Under Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="ready-for-payment">Ready for Payment</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab} className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {currentTab === 'all' ? 'All Approvals' : `${getStatusFromTab(currentTab)} Approvals`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading approvals...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>Error loading approvals. Please try again.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Transaction</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                          <th className="text-right py-3 px-4 font-medium text-sm">Amount</th>
                          <th className="text-center py-3 px-4 font-medium text-sm">Status</th>
                          <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.approvals.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground">
                              No approvals found in this category.
                            </td>
                          </tr>
                        ) : (
                          data?.approvals.map((approval) => (
                            <tr key={approval.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                {approval.transaction_id.slice(0, 8)}...
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(approval.property_transactions.transaction_date)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {formatCurrency(approval.property_transactions.commission_amount)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(approval.status)}`}>
                                    {getStatusIcon(approval.status)}
                                    <span className="ml-1">{approval.status}</span>
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/commission/approvals/${approval.id}`)}
                                >
                                  Review
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 0 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.totalCount || 0)} of {data?.totalCount} results
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Label className="text-sm">
                          Page {page} of {totalPages}
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={page >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalDashboard;
