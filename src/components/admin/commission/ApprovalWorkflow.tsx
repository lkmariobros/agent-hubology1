
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Banknote,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApprovalWorkflowProps {
  currentStatus: string;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ currentStatus }) => {
  // Define our workflow steps
  const steps = [
    { id: 'Pending', label: 'Pending', icon: Clock },
    { id: 'Under Review', label: 'Under Review', icon: AlertTriangle },
    { id: 'Approved', label: 'Approved', icon: CheckCircle },
    { id: 'Ready for Payment', label: 'Ready for Payment', icon: Banknote },
    { id: 'Paid', label: 'Paid', icon: CheckCircle },
  ];

  // Find the current step index (if rejected, use a special case)
  let currentIndex = steps.findIndex(step => step.id === currentStatus);
  const isRejected = currentStatus === 'Rejected';

  return (
    <div className="py-6">
      {isRejected ? (
        <div className="bg-red-50 border border-red-100 rounded-md p-4 flex items-center">
          <XCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <p className="font-medium text-red-700">Commission Rejected</p>
            <p className="text-sm text-red-600">This commission has been rejected and will not proceed further in the approval process.</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
            <div 
              className="h-0.5 bg-primary transition-all" 
              style={{ 
                width: `${currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%` 
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              // Determine the status of this step
              let status: 'complete' | 'current' | 'upcoming' = 'upcoming';
              if (index < currentIndex) {
                status = 'complete';
              } else if (index === currentIndex) {
                status = 'current';
              }

              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  {/* Step circle */}
                  <div 
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full
                      ${status === 'complete' ? 'bg-primary text-primary-foreground' : 
                        status === 'current' ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                        'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  {/* Label */}
                  <span 
                    className={`
                      mt-2 text-xs font-medium whitespace-nowrap
                      ${status === 'complete' ? 'text-primary' : 
                        status === 'current' ? 'text-primary' :
                        'text-muted-foreground'
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current step details */}
          <div className="mt-8 bg-muted/30 border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Current Step: {steps[currentIndex]?.label || 'Unknown'}</h4>
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
      )}
    </div>
  );
};

export default ApprovalWorkflow;
