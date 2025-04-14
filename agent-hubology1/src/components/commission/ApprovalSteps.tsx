
import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Banknote } from 'lucide-react';

interface ApprovalStepsProps {
  currentStatus: string;
  className?: string;
}

const ApprovalSteps: React.FC<ApprovalStepsProps> = ({ currentStatus, className = '' }) => {
  // Define the steps in the approval workflow
  const steps = [
    { id: 'Pending', label: 'Pending', icon: Clock },
    { id: 'Under Review', label: 'Under Review', icon: AlertTriangle },
    { id: 'Approved', label: 'Approved', icon: CheckCircle2 },
    { id: 'Ready for Payment', label: 'Ready for Payment', icon: Banknote },
    { id: 'Paid', label: 'Paid', icon: CheckCircle2 }
  ];

  // Find the current step index
  const currentIndex = steps.findIndex(step => step.id === currentStatus);
  const isRejected = currentStatus === 'Rejected';
  
  return (
    <div className={`relative ${className}`}>
      {/* Don't show the progress bar if the status is rejected */}
      {!isRejected && (
        <>
          {/* Background track */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded"></div>
          
          {/* Progress fill */}
          <div 
            className="absolute top-5 left-0 h-1 bg-primary rounded transition-all duration-500 ease-in-out"
            style={{ width: `${currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%` }}
          ></div>
          
          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              // Determine the status of this step
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isActive ? 'bg-primary text-white ring-4 ring-primary/20' : 
                        isCompleted ? 'bg-primary text-white' : 
                        'bg-gray-200 text-gray-500'}
                      transition-all duration-300
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span 
                    className={`
                      mt-2 text-xs font-medium whitespace-nowrap
                      ${isActive || isCompleted ? 'text-primary' : 'text-gray-500'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {/* Show a special message if rejected */}
      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="bg-red-100 rounded-full p-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-medium text-red-800">Commission Rejected</h4>
            <p className="text-sm text-red-600 mt-1">
              This commission has been rejected and will not proceed through the approval workflow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalSteps;
