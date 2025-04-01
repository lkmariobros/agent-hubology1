
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePaymentScheduleAdmin } from '@/hooks/usePaymentScheduleAdmin';

export function PaymentSchedulesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<PaymentSchedule | null>(null);
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  const [installments, setInstallments] = useState<Partial<ScheduleInstallment>[]>([{ 
    installmentNumber: 1, 
    percentage: 100, 
    daysAfterTransaction: 0 
  }]);
  
  const queryClient = useQueryClient();
  
  // Fetch all payment schedules
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['paymentSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_payment_schedules')
        .select('*, installments:schedule_installments(*)');
        
      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map(schedule => ({
        id: schedule.id,
        name: schedule.name,
        description: schedule.description,
        isDefault: schedule.is_default,
        createdAt: schedule.created_at,
        updatedAt: schedule.updated_at,
        installments: schedule.installments.map((inst: any) => ({
          id: inst.id,
          scheduleId: inst.schedule_id,
          installmentNumber: inst.installment_number,
          percentage: inst.percentage,
          daysAfterTransaction: inst.days_after_transaction,
          description: inst.description
        }))
      })) as PaymentSchedule[];
    }
  });
  
  const { 
    createPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    setDefaultSchedule
  } = usePaymentScheduleAdmin();
  
  const resetForm = () => {
    setScheduleName('');
    setScheduleDescription('');
    setInstallments([{ installmentNumber: 1, percentage: 100, daysAfterTransaction: 0 }]);
    setCurrentSchedule(null);
  };
  
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
    // Validate total percentage equals 100%
    const totalPercentage = installments.reduce((sum, inst) => sum + (Number(inst.percentage) || 0), 0);
    
    if (totalPercentage !== 100) {
      toast.error('Total percentage must equal 100%');
      return;
    }
    
    if (isEditing && currentSchedule) {
      updatePaymentSchedule({
        scheduleId: currentSchedule.id,
        schedule: {
          name: scheduleName,
          description: scheduleDescription,
          installments
        }
      });
    } else {
      createPaymentSchedule({
        name: scheduleName,
        description: scheduleDescription,
        installments
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const handleEditSchedule = (schedule: PaymentSchedule) => {
    setCurrentSchedule(schedule);
    setScheduleName(schedule.name);
    setScheduleDescription(schedule.description || '');
    setInstallments(schedule.installments || []);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this payment schedule?')) {
      deletePaymentSchedule(scheduleId);
    }
  };
  
  const handleNewSchedule = () => {
    resetForm();
    setInstallments([{ installmentNumber: 1, percentage: 100, daysAfterTransaction: 0 }]);
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  const handleSetDefault = (scheduleId: string) => {
    setDefaultSchedule(scheduleId);
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Create and manage payment schedules for commission installments
        </p>
        <Button onClick={handleNewSchedule}>
          <Plus className="h-4 w-4 mr-2" /> New Schedule
        </Button>
      </div>
      
      {!schedules || schedules.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-48">
            <p className="text-lg text-muted-foreground mb-4">No payment schedules found</p>
            <Button onClick={handleNewSchedule}>Create First Schedule</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {schedules.map(schedule => (
            <Card key={schedule.id}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <CardTitle>{schedule.name}</CardTitle>
                  {schedule.isDefault && (
                    <Badge className="ml-2 bg-primary">Default</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!schedule.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(schedule.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    disabled={schedule.isDefault}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {schedule.description && (
                  <p className="text-muted-foreground mb-4">{schedule.description}</p>
                )}
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Installment</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Days After Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.installments?.sort((a, b) => a.installmentNumber - b.installmentNumber).map(installment => (
                      <TableRow key={installment.id}>
                        <TableCell>{installment.installmentNumber}</TableCell>
                        <TableCell>{installment.percentage}%</TableCell>
                        <TableCell>{installment.daysAfterTransaction} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Payment Schedule' : 'New Payment Schedule'}</DialogTitle>
            <DialogDescription>
              Configure how commission payments are split into installments
            </DialogDescription>
          </DialogHeader>
          
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
                <Button size="sm" variant="outline" onClick={handleAddInstallment}>
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
                          <span>
                            {installments.reduce((sum, inst) => sum + (Number(inst.percentage) || 0), 0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell colSpan={2}>
                        {installments.reduce((sum, inst) => sum + (Number(inst.percentage) || 0), 0) !== 100 && (
                          <p className="text-destructive text-sm">Total must equal 100%</p>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={
                !scheduleName || 
                installments.reduce((sum, inst) => sum + (Number(inst.percentage) || 0), 0) !== 100
              }
            >
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
