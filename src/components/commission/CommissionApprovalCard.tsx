
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/admin/commission/StatusBadge';
import { formatCurrency } from '@/utils/formattingUtils';
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ApprovalSteps from './ApprovalSteps';

interface CommissionApprovalCardProps {
  approvalData: {
    id: string;
    status: string;
    transactionId: string;
    submittedBy: string;
    submittedByName?: string;
    submittedAt: string;
    transactionDate?: string;
    propertyTitle?: string;
    commissionAmount: number;
  };
  showActions?: boolean;
}

const CommissionApprovalCard: React.FC<CommissionApprovalCardProps> = ({ 
  approvalData,
  showActions = true
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/admin/commission/approval/${approvalData.id}`);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle size="sm">
              {approvalData.propertyTitle || `Transaction #${approvalData.transactionId.substring(0, 8)}`}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>
                {approvalData.transactionDate 
                  ? format(parseISO(approvalData.transactionDate), 'MMM d, yyyy')
                  : 'Date not available'}
              </span>
            </div>
          </div>
          <StatusBadge status={approvalData.status} size="md" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="card-spacing">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Commission Amount:</div>
            <div className="font-semibold text-lg">{formatCurrency(approvalData.commissionAmount)}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Submitted By:</div>
            <div>{approvalData.submittedByName || approvalData.submittedBy}</div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Submitted {format(parseISO(approvalData.submittedAt), 'MMM d, yyyy')}</span>
          </div>
          
          <ApprovalSteps currentStatus={approvalData.status} className="mt-6" />
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleViewDetails} 
            className="w-full"
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommissionApprovalCard;
