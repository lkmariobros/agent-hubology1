
// This file is a wrapper around the refactored auth context for backward compatibility
import { AuthProvider, useAuthContext } from './auth';
import type { AuthContextType } from './auth';

// Re-export for backward compatibility
export { AuthProvider, useAuthContext, useAuthContext as useAuth };
export type { AuthContextType };
