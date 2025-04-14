
import React from 'react';
import ApprovalSteps from '@/components/commission/ApprovalSteps';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface ApprovalWorkflowProps {
  currentStatus: string;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ currentStatus }) => {
  return (
    <div className="py-6">
      <ApprovalSteps currentStatus={currentStatus} />
      
      {/* Current step details */}
      <div className="mt-8 bg-muted/30 border rounded-md p-4">
        <h4 className="text-sm font-medium mb-2">Current Status: {currentStatus}</h4>
        <p className="text-sm text-muted-foreground">
          {currentStatus === 'Pending' && 
            "This commission is pending initial review. An administrator will verify the details and either approve or reject it."}
          {currentStatus === 'Under Review' && 
            "This commission is currently being reviewed. The administrator is checking the transaction details, verification documents, and confirming the commission amount."}
          {currentStatus === 'Approved' && 
            "This commission has been approved. It is now awaiting to be marked as ready for payment by the finance department."}
          {currentStatus === 'Ready for Payment' && 
            "This commission is ready for payment and has been queued for the next payment cycle."}
          {currentStatus === 'Paid' && 
            "This commission has been paid. The process is complete."}
          {currentStatus === 'Rejected' &&
            "This commission has been rejected and will not proceed further in the approval process."}
        </p>
        
        {currentStatus === 'Under Review' && (
          <div className="flex items-center mt-2 text-sm">
            <Badge variant="outline" className="bg-muted/50">Required action</Badge>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span>Verify transaction details and approve or reject</span>
          </div>
        )}
        
        {currentStatus === 'Approved' && (
          <div className="flex items-center mt-2 text-sm">
            <Badge variant="outline" className="bg-muted/50">Required action</Badge>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span>Mark as ready for payment when appropriate</span>
          </div>
        )}
        
        {currentStatus === 'Ready for Payment' && (
          <div className="flex items-center mt-2 text-sm">
            <Badge variant="outline" className="bg-muted/50">Required action</Badge>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span>Process payment and mark as paid</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
