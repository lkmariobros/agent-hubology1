
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePaymentScheduleAdmin } from '@/hooks/usePaymentScheduleAdmin';
import { PaymentSchedule } from '@/types/commission';
import InstallmentsList from '../../commission/InstallmentsList';
import PaymentScheduleForm from './PaymentScheduleForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function PaymentSchedulesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<PaymentSchedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  
  const { 
    schedules,
    isLoading,
    createPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    setDefaultSchedule
  } = usePaymentScheduleAdmin();
  
  const handleNewSchedule = () => {
    setCurrentSchedule(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  const handleEditSchedule = (schedule: PaymentSchedule) => {
    setCurrentSchedule(schedule);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (data: any) => {
    if (isEditing && currentSchedule) {
      updatePaymentSchedule.mutate({
        scheduleId: currentSchedule.id,
        schedule: data
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
        }
      });
    } else {
      createPaymentSchedule.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        }
      });
    }
  };
  
  const handleDeleteClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (scheduleToDelete) {
      deletePaymentSchedule.mutate(scheduleToDelete);
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };
  
  const handleSetDefault = (scheduleId: string) => {
    setDefaultSchedule.mutate(scheduleId);
  };
  
  const isSubmitting = createPaymentSchedule.isPending || updatePaymentSchedule.isPending;
  
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
                    onClick={() => handleDeleteClick(schedule.id)}
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
                
                <InstallmentsList installments={schedule.installments || []} />
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
          
          <PaymentScheduleForm
            schedule={currentSchedule || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment schedule and all its installments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deletePaymentSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
