
// This file is now a wrapper around the unified AuthContext for backward compatibility
import { useAuthContext } from '@/context/AuthContext';

// Re-export the hook for backward compatibility
export const useAuth = useAuthContext;

// Re-export the context for direct use if needed
export { useAuthContext } from '@/context/AuthContext';
