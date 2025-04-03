
import { useState } from 'react';
import { clerkAdminService } from '@/services/clerkAdminService';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * Hook for using Clerk admin functions that require server-side secret key
 */
export function useClerkAdmin() {
  const [loading, setLoading] = useState(false);
  
  // Mutation for assigning a role to a user
  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) => {
      return clerkAdminService.assignRole(userId, role);
    },
    onSuccess: () => {
      toast.success('Role assigned successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign role: ${error.message || 'Unknown error'}`);
    }
  });
  
  // Function to get user roles
  const getUserRoles = async (userId: string) => {
    try {
      setLoading(true);
      const result = await clerkAdminService.getUserRoles(userId);
      return result;
    } catch (error: any) {
      toast.error(`Failed to get user roles: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Query function to get user roles
  const useUserRoles = (userId?: string) => {
    return useQuery({
      queryKey: ['userRoles', userId],
      queryFn: () => clerkAdminService.getUserRoles(userId!),
      enabled: !!userId
    });
  };
  
  return {
    getUserRoles,
    assignRole: assignRoleMutation.mutateAsync,
    useUserRoles,
    isAssigningRole: assignRoleMutation.isPending,
    loading
  };
}

export default useClerkAdmin;
