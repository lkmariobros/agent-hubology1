
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Banknote,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/propertyUtils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCommissionApprovals } from '@/hooks/useCommissionApproval';
import { useAuth } from '@/hooks/useAuth';

interface CommissionApprovalStatusProps {
  limit?: number;
  showViewAll?: boolean;
}

const CommissionApprovalStatus: React.FC<CommissionApprovalStatusProps> = ({ 
  limit = 5,
  showViewAll = true
}) => {
  const { user } = useAuth();
  const { data, isLoading, error } = useCommissionApprovals(
    undefined, // Get all statuses
    false, // Not admin
    user?.id,
    1,
    limit
  );
  
  const approvals = data?.approvals || [];
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'under review':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ready for payment':
        return <Banknote className="h-4 w-4 text-purple-500" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get status badge style
  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'under review':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'ready for payment':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'paid':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Approvals</CardTitle>
          <CardDescription>Status of your commission approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-md bg-muted">
                <div className="space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-32"></div>
                </div>
                <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Error loading approvals. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (approvals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Approvals</CardTitle>
          <CardDescription>Status of your commission approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            You don't have any commission approvals yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Approvals</CardTitle>
        <CardDescription>Status of your commission approvals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(approval.status)}
                  <span className="font-medium">
                    {formatCurrency(approval.property_transactions?.commission_amount || 0)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(approval.created_at)}
                </p>
              </div>
              <Badge className={getStatusBadgeClass(approval.status)}>
                {approval.status}
              </Badge>
            </div>
          ))}
        </div>
        
        {showViewAll && data?.totalCount > limit && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/commission">
                View All <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionApprovalStatus;
