
// This file is a wrapper around the refactored auth context for backward compatibility
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export { AuthProvider };
export { useAuth as useAuthContext };

// Export default useAuth for backward compatibility
export const useAuth = useAuth;
export type { AuthContextType };

export default AuthProvider;
