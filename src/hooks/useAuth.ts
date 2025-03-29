
// This file is a wrapper around the AuthContext for backward compatibility
import { useAuthContext } from '@/context/auth';
import type { AuthContextType } from '@/types/auth';

// Simple re-export of the auth context hook
const useAuth = useAuthContext;

// Export the type for use in components
export type { AuthContextType };

export default useAuth;
