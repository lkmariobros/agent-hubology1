
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Role } from '@/types/role';

interface DeleteRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: Role | null;
  isDeleting: boolean;
}

export function DeleteRoleDialog({
  open,
  onClose,
  onConfirm,
  role,
  isDeleting
}: DeleteRoleDialogProps) {
  if (!role) return null;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the role "{role.name}" and remove it from all users who have it.
            {role.users_count && role.users_count > 0 ? (
              <p className="mt-2 font-semibold text-destructive">
                Warning: This role is assigned to {role.users_count} {role.users_count === 1 ? 'user' : 'users'}.
              </p>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Role'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
