
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useCommissionApproval, { CommissionApproval } from '@/hooks/useCommissionApproval';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const BulkApprovalTools = () => {
  const navigate = useNavigate();
  const { useUpdateApprovalStatusMutation, useCommissionApprovals } = useCommissionApproval;
  const updateStatusMutation = useUpdateApprovalStatusMutation();
  
  // Initialize state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>('Pending');
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Get approval data
  const { data: approvalsData, isLoading } = useCommissionApprovals(
    activeStatus,
    true,
    undefined,
    page,
    pageSize
  );
  
  const approvals = approvalsData?.approvals || [];
  const totalCount = approvalsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Handle checkbox selection
  const handleSelectItem = (id: string, isChecked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (isChecked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
    
    // Update selectAll state based on whether all visible items are selected
    setSelectAll(
      newSelected.size > 0 && approvals.every(item => newSelected.has(item.id))
    );
  };
  
  // Handle select all
  const handleSelectAll = (isChecked: boolean) => {
    setSelectAll(isChecked);
    
    if (isChecked) {
      setSelectedIds(new Set(approvals.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };
  
  // Handle bulk status update
  const handleBulkUpdate = async () => {
    if (!newStatus || selectedIds.size === 0) {
      toast.warning('Please select items and a new status');
      return;
    }
    
    try {
      // Process each selected approval one by one
      const promises = Array.from(selectedIds).map(id => 
        updateStatusMutation.mutateAsync({
          approvalId: id,
          newStatus,
          notes: statusNotes || undefined
        })
      );
      
      await Promise.all(promises);
      
      toast.success(`Successfully updated ${selectedIds.size} approvals to ${newStatus}`);
      
      // Reset selection and refresh data
      setSelectedIds(new Set());
      setSelectAll(false);
      setNewStatus('');
      setStatusNotes('');
      
    } catch (error) {
      toast.error('Failed to update some approvals');
      console.error('Bulk update error:', error);
    }
  };
  
  // Handle status change
  const handleStatusChange = (value: string) => {
    setActiveStatus(value);
    setPage(1);
    setSelectedIds(new Set());
    setSelectAll(false);
  };
  
  // Get valid status options based on current selection
  const getStatusOptions = () => {
    const currentStatus = activeStatus;
    
    switch (currentStatus) {
      case 'Pending':
        return ['Under Review', 'Approved', 'Rejected'];
      case 'Under Review':
        return ['Approved', 'Rejected'];
      case 'Approved':
        return ['Ready for Payment', 'Rejected'];
      case 'Ready for Payment':
        return ['Paid', 'Rejected'];
      case 'Rejected':
        return ['Pending'];
      default:
        return [];
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Approval Management</CardTitle>
        <CardDescription>
          Process multiple approvals at once
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={activeStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Ready for Payment">Ready for Payment</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedIds.size > 0 && (
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Change Status To</label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {selectedIds.size > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                placeholder="Add notes for this status change"
                value={statusNotes}
                onChange={e => setStatusNotes(e.target.value)}
              />
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No approvals found with this status.</p>
            </div>
          ) : (
            <div>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all" 
                        />
                      </th>
                      <th className="text-left p-2">Transaction</th>
                      <th className="text-left p-2">Submitted</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {approvals.map((approval) => (
                      <tr key={approval.id} className="hover:bg-muted/50">
                        <td className="p-2">
                          <Checkbox 
                            checked={selectedIds.has(approval.id)}
                            onCheckedChange={(checked) => 
                              handleSelectItem(approval.id, checked === true)
                            }
                            aria-label={`Select approval ${approval.id}`}
                          />
                        </td>
                        <td className="p-2">
                          {approval.transaction_id?.substring(0, 8) || 'Unknown'}
                        </td>
                        <td className="p-2">
                          {formatDate(approval.created_at)}
                        </td>
                        <td className="p-2">
                          <StatusBadge status={approval.status} />
                        </td>
                        <td className="p-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/admin/commission-approvals/${approval.id}`)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
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
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleBulkUpdate}
          disabled={selectedIds.size === 0 || !newStatus || updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Update ${selectedIds.size} Approval${selectedIds.size !== 1 ? 's' : ''}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkApprovalTools;
