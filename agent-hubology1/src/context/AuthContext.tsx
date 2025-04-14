
// This file is a wrapper around the refactored auth context for backward compatibility
import { AuthProvider, useAuthContext } from './auth';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export { AuthProvider, useAuthContext };

// Export default useAuthContext as useAuth for backward compatibility
export const useAuth = useAuthContext;
export type { AuthContextType };

export default AuthProvider;
