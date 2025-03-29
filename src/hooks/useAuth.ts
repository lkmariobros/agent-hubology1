
// Simple re-export of the auth context hook for backward compatibility
import { useAuthContext } from '@/context/auth';
import type { AuthContextType } from '@/types/auth';

// Export the useAuthContext hook as the default export for backward compatibility
export default useAuthContext;

// Export the type for use in components
export type { AuthContextType };
