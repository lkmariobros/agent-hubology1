
// This file is a wrapper around the AuthContext for backward compatibility
import { useAuthContext } from '@/context/auth';
import type { AuthContextType } from '@/types/auth';

// Export the hook as the default export
const useAuth = useAuthContext;

// Export the type for use in components
export type { AuthContextType };

export default useAuth;
