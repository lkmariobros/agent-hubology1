
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';

interface PaymentScheduleFormProps {
  schedule?: PaymentSchedule;
  onSubmit: (data: {
    name: string;
    description?: string;
    installments: Partial<ScheduleInstallment>[];
  }) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
}

const PaymentScheduleForm: React.FC<PaymentScheduleFormProps> = ({
  schedule,
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  const [installments, setInstallments] = useState<Partial<ScheduleInstallment>[]>([
    { installmentNumber: 1, percentage: 100, daysAfterTransaction: 0 }
  ]);

  // Initialize form state from schedule if provided
  useEffect(() => {
    if (schedule) {
      setScheduleName(schedule.name);
      setScheduleDescription(schedule.description || '');
      setInstallments(schedule.installments || []);
    }
  }, [schedule]);

  const handleAddInstallment = () => {
    const lastInstallment = installments[installments.length - 1];
    const newInstallmentNumber = (lastInstallment?.installmentNumber || 0) + 1;
    
    setInstallments([
      ...installments, 
      { installmentNumber: newInstallmentNumber, percentage: 0, daysAfterTransaction: 0 }
    ]);
  };
  
  const handleRemoveInstallment = (index: number) => {
    const newInstallments = [...installments];
    newInstallments.splice(index, 1);
    
    // Renumber installments
    const renumberedInstallments = newInstallments.map((inst, idx) => ({
      ...inst,
      installmentNumber: idx + 1
    }));
    
    setInstallments(renumberedInstallments);
  };
  
  const handleInstallmentChange = (index: number, field: string, value: any) => {
    const newInstallments = [...installments];
    newInstallments[index] = { ...newInstallments[index], [field]: value };
    setInstallments(newInstallments);
  };
  
  const handleSubmit = () => {
    onSubmit({
      name: scheduleName,
      description: scheduleDescription,
      installments
    });
  };
  
  // Calculate total percentage
  const totalPercentage = installments.reduce(
    (sum, inst) => sum + (Number(inst.percentage) || 0), 
    0
  );
  
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6">
            Schedule Name
          </label>
          <Input
            id="name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            placeholder="e.g., Standard Quarterly Payments"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6">
            Description (Optional)
          </label>
          <Input
            id="description"
            value={scheduleDescription}
            onChange={(e) => setScheduleDescription(e.target.value)}
            placeholder="Brief description of this payment schedule"
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium leading-6">Installments</h3>
          <Button size="sm" variant="outline" onClick={handleAddInstallment} type="button">
            <Plus className="h-3 w-3 mr-1" /> Add Installment
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Installment #</TableHead>
                <TableHead>Percentage (%)</TableHead>
                <TableHead>Days After Transaction</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((installment, index) => (
                <TableRow key={index}>
                  <TableCell>{installment.installmentNumber}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={installment.percentage}
                      onChange={(e) => handleInstallmentChange(index, 'percentage', Number(e.target.value))}
                      min="0"
                      max="100"
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={installment.daysAfterTransaction}
                      onChange={(e) => handleInstallmentChange(index, 'daysAfterTransaction', Number(e.target.value))}
                      min="0"
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInstallment(index)}
                      disabled={installments.length <= 1}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className={totalPercentage !== 100 ? 'text-destructive font-bold' : 'font-bold'}>
                      {totalPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell colSpan={2}>
                  {totalPercentage !== 100 && (
                    <p className="text-destructive text-sm">Total must equal 100%</p>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={
            !scheduleName || 
            totalPercentage !== 100 ||
            isSubmitting
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Schedule'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentScheduleForm;
