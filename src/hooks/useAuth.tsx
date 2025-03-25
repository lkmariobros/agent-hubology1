
import { useAuth as useAuthFromContext } from '@/context/AuthContext';

/**
 * Enhanced authentication hook that extends the base useAuth context
 * with additional role-related functionality.
 */
export const useAuth = () => {
  // Get the base auth context
  const auth = useAuthFromContext();
  
  // Determine if the current route is in the admin section
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  // Add role checking capability with better null safety
  const isAdmin = auth.user?.email ? 
    auth.isAdmin : false;
  
  return {
    ...auth,
    isAdmin,
    roles: auth.user ? auth.roles || [] : [],
    activeRole: isAdminRoute ? 'admin' : 'agent',
    switchRole: (role: 'agent' | 'admin') => {
      console.log(`Switching to ${role} role`);
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }
  };
};
