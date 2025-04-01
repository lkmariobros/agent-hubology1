
// This file is a wrapper around the refactored auth context for backward compatibility
import { AuthProvider } from './auth/AuthProvider';
import { useAuth as importedUseAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/types/auth';

// Re-export for backward compatibility
export { AuthProvider };
export { importedUseAuth as useAuth };
export { importedUseAuth as useAuthContext };
export type { AuthContextType };

export default AuthProvider;
