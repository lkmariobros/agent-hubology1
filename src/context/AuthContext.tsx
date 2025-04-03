
// This file is a wrapper around the refactored auth context for backward compatibility
import { ClerkAuthProvider, useAuth as useClerkAuth } from '../providers/ClerkAuthProvider';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export { ClerkAuthProvider as AuthProvider };
export { useClerkAuth as useAuthContext };

// Export default useClerkAuth as useAuth for backward compatibility
export const useAuth = useClerkAuth;
export type { AuthContextType };

export default ClerkAuthProvider;
