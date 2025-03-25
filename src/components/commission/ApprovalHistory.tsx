
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, CheckCircle2, XCircle, AlertTriangle, Clock, Banknote } from 'lucide-react';
import { CommissionApprovalHistory } from '@/hooks/useCommissionApproval';

interface ApprovalHistoryProps {
  history: CommissionApprovalHistory[];
  isLoading?: boolean;
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ history, isLoading }) => {
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
      case 'Rejected':
        return 'bg-red-100 text-red-800';
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
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <History className="h-4 w-4 mr-2" />
            Approval History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <History className="h-4 w-4 mr-2" />
            Approval History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">No approval history available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <History className="h-4 w-4 mr-2" />
          Approval History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((record, index) => (
            <div key={record.id} className="relative pl-6 pb-6 border-l-2 border-muted">
              <div className={`absolute top-0 left-[-8px] h-4 w-4 rounded-full ${
                record.new_status === 'Rejected' ? 'bg-red-500' : 
                record.new_status === 'Approved' ? 'bg-green-500' :
                record.new_status === 'Ready for Payment' ? 'bg-purple-500' :
                record.new_status === 'Paid' ? 'bg-blue-500' : 'bg-amber-500'
              }`}></div>
              <div className="mb-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.new_status)}`}>
                  {getStatusIcon(record.new_status)}
                  <span className="ml-1">{record.new_status}</span>
                </span>
                <span className="mx-2 text-xs text-muted-foreground">from</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.previous_status)}`}>
                  {getStatusIcon(record.previous_status)}
                  <span className="ml-1">{record.previous_status}</span>
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(record.created_at)}
              </div>
              
              {record.notes && (
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">{record.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalHistory;
