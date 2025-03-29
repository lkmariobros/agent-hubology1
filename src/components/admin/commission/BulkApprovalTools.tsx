import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCommissionApprovals, useUpdateApprovalStatus } from '@/hooks/useCommissionApproval';
import { formatCurrency } from '@/utils/propertyUtils';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface BulkApprovalToolsProps {
  onComplete?: () => void;
}

const BulkApprovalTools: React.FC<BulkApprovalToolsProps> = ({ onComplete }) => {
  const { user, isAdmin } = useAuth();
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [targetStatus, setTargetStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data, isLoading, refetch } = useCommissionApprovals(
    'Pending', // Only fetch pending approvals for bulk actions
    true, // Admin view
    undefined, // All users
    1,
    100 // Get up to 100 pending approvals
  );
  
  const updateStatusMutation = useUpdateApprovalStatus();
  
  const handleSelectAll = () => {
    if (!data) return;
    
    if (selectedApprovals.length === data.approvals.length) {
      setSelectedApprovals([]);
    } else {
      setSelectedApprovals(data.approvals.map(approval => approval.id));
    }
  };
  
  const handleSelectApproval = (approvalId: string) => {
    if (selectedApprovals.includes(approvalId)) {
      setSelectedApprovals(selectedApprovals.filter(id => id !== approvalId));
    } else {
      setSelectedApprovals([...selectedApprovals, approvalId]);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleBulkUpdate = async () => {
    if (!targetStatus || selectedApprovals.length === 0) {
      toast.error('Please select approvals and a target status');
      return;
    }
    
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;
    
    for (const approvalId of selectedApprovals) {
      try {
        await updateStatusMutation.mutateAsync({
          approvalId,
          status: targetStatus,
          notes: `Bulk updated to ${targetStatus} status`
        });
        successCount++;
      } catch (error) {
        console.error(`Error updating approval ${approvalId}:`, error);
        errorCount++;
      }
    }
    
    if (successCount > 0) {
      toast.success(`Successfully updated ${successCount} approval(s)`);
    }
    
    if (errorCount > 0) {
      toast.error(`Failed to update ${errorCount} approval(s)`);
    }
    
    setIsProcessing(false);
    setSelectedApprovals([]);
    setTargetStatus('');
    
    // Refresh the data
    refetch();
    
    if (onComplete) {
      onComplete();
    }
  };
  
  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-muted-foreground">
              You need administrator privileges to access bulk approval tools.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Approval Tools</CardTitle>
        <CardDescription>Process multiple commission approvals at once</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !data || data.approvals.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">
              No pending approvals available for bulk processing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedApprovals.length === data.approvals.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.approvals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedApprovals.includes(approval.id)}
                          onCheckedChange={() => handleSelectApproval(approval.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={approval.status} />
                      </TableCell>
                      <TableCell>{formatDate(approval.created_at)}</TableCell>
                      <TableCell>
                        {formatCurrency(approval.property_transactions.commission_amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/admin/commissions/${approval.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between bg-muted/50 p-4 rounded-b-lg">
        <div className="w-full sm:w-auto">
          <Select
            value={targetStatus}
            onValueChange={setTargetStatus}
            disabled={isProcessing || selectedApprovals.length === 0}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select target status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {selectedApprovals.length} approval(s) selected
          </p>
          <Button
            variant="default"
            onClick={handleBulkUpdate}
            disabled={isProcessing || targetStatus === '' || selectedApprovals.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Update Selected (${selectedApprovals.length})`
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BulkApprovalTools;
