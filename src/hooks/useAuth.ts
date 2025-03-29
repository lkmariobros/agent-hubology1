
// This file is now a wrapper around the unified AuthContext for backward compatibility
import { useAuthContext } from '@/context/AuthContext';
import type { AuthContextType } from '@/types/auth';

// Re-export the hook for backward compatibility
export const useAuth = useAuthContext;

// Export the type for use in components
export type { AuthContextType };

// Re-export the context for direct use if needed
export { useAuthContext } from '@/context/AuthContext';
