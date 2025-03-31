
// This file is a wrapper around the refactored auth context for backward compatibility
import { AuthProvider as CoreAuthProvider } from './auth/AuthProvider';
import { useAuthContext } from './auth/AuthContext';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export const AuthProvider = CoreAuthProvider;
export { useAuthContext };

// Export default useAuthContext as useAuth for backward compatibility
export const useAuth = useAuthContext;
export type { AuthContextType };

export default CoreAuthProvider;
