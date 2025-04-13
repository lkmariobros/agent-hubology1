import { useState, useCallback } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { toast } from 'sonner';

/**
 * Hook to fetch Clerk users for use in the application
 */
export function useClerkUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const clerk = useClerk();

  /**
   * Fetch all Clerk users
   * This is a mock implementation that would normally call the Clerk API
   * In a real implementation, this would use the Clerk Backend API
   */
  const getClerkUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This is a mock implementation
      // In a real implementation, you would call the Clerk Backend API
      // Example: const users = await clerkClient.users.getUserList();
      
      // Return the current user as a placeholder
      // This simulates what would be returned from the Clerk API
      if (clerk.user) {
        return [clerk.user];
      }
      
      // Simulate an API response with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return an empty array if no current user
      return [];
    } catch (err) {
      console.error('Error fetching Clerk users:', err);
      const error = err instanceof Error ? err : new Error('Failed to fetch users');
      setError(error);
      toast.error('Failed to load users');
      return [];
    } finally {
      setLoading(false);
    }
  }, [clerk.user]);

  return {
    getClerkUsers,
    loading,
    error
  };
}

export default useClerkUsers;