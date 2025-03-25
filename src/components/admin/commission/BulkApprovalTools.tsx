
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { 
  usePendingCommissionApprovals,
  useBulkApproveCommissions,
  useBulkRejectCommissions,
} from '@/hooks/useCommissionApproval';
import StatusBadge from './StatusBadge';

interface BulkApprovalToolsProps {
  onComplete: () => void;
}

const BulkApprovalTools: React.FC<BulkApprovalToolsProps> = ({ onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { data, isLoading } = usePendingCommissionApprovals();
  const approveCommissions = useBulkApproveCommissions();
  const rejectCommissions = useBulkRejectCommissions();
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds((data?.approvals || []).map(approval => approval.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one commission to approve');
      return;
    }
    
    approveCommissions.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`${selectedIds.length} commissions approved successfully`);
        setSelectedIds([]);
        setSelectAll(false);
        onComplete();
      },
      onError: (error) => {
        toast.error(`Failed to approve commissions: ${error.message}`);
      }
    });
  };
  
  const handleBulkReject = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one commission to reject');
      return;
    }
    
    rejectCommissions.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`${selectedIds.length} commissions rejected`);
        setSelectedIds([]);
        setSelectAll(false);
        onComplete();
      },
      onError: (error) => {
        toast.error(`Failed to reject commissions: ${error.message}`);
      }
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.approvals.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-muted-foreground">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>No pending commissions requiring approval</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Bulk Actions</h3>
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleBulkApprove}
              disabled={selectedIds.length === 0 || approveCommissions.isPending}
            >
              {approveCommissions.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve Selected
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkReject}
              disabled={selectedIds.length === 0 || rejectCommissions.isPending}
            >
              {rejectCommissions.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject Selected
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectAll} 
                  onCheckedChange={handleSelectAll} 
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Threshold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.includes(approval.id)} 
                    onCheckedChange={() => handleSelect(approval.id)} 
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge status={approval.status} />
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {approval.property_transactions.property.title || 'Untitled Property'}
                </TableCell>
                <TableCell>
                  {approval.agent.name || 'Unknown Agent'}
                </TableCell>
                <TableCell>
                  {formatCurrency(approval.property_transactions.commission_amount)}
                </TableCell>
                <TableCell>
                  {approval.threshold_exceeded ? (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Exceeds</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Within</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BulkApprovalTools;
