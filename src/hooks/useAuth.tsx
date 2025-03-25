
import { useAuth as useAuthFromContext } from '@/context/AuthContext';
import { UserRole } from '@/providers/AuthProvider';

/**
 * Enhanced authentication hook that extends the base useAuth context
 * with additional role-related functionality.
 */
export const useAuth = () => {
  // Get the base auth context
  const auth = useAuthFromContext();
  
  // Determine if the current route is in the admin section
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  // Check if the user email contains admin patterns (temporary solution until proper roles)
  const userEmail = auth.user?.email || '';
  const adminEmailPatterns = ['admin', 'test'];
  const isAdminByEmail = adminEmailPatterns.some(pattern => 
    userEmail.toLowerCase().includes(pattern.toLowerCase())
  );
  
  // Determine admin status based on email
  const isAdmin = !!auth.user && isAdminByEmail;
  
  // Infer roles from email patterns (temporary until DB-backed roles)
  const roles: UserRole[] = ['agent'];
  if (isAdmin) roles.push('admin');
  
  return {
    ...auth,
    isAdmin,
    roles,
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
