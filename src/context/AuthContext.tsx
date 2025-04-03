
// This file is a wrapper around the refactored auth context for backward compatibility
import { ClerkAuthProvider, useAuth } from '../providers/ClerkAuthProvider';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export { ClerkAuthProvider as AuthProvider };
export { useAuth as useAuthContext };

// Export default useAuth as useAuth for backward compatibility
export { useAuth };
export type { AuthContextType };

export default ClerkAuthProvider;
