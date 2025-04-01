
// This file is a wrapper around the refactored auth context for backward compatibility
import { AuthProvider } from './auth/AuthProvider';
import { useAuth as useAuthHook } from '@/hooks/useAuth';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export { AuthProvider };
export { useAuthHook as useAuth };
export { useAuthHook as useAuthContext };
export type { AuthContextType };

export default AuthProvider;
