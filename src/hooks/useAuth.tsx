
import { useAuth as useAuthFromContext } from '@/providers/AuthProvider';
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
  
  // Check if the user email contains admin patterns
  // This is a simpler approach to detect admin users until proper roles are implemented
  const userEmail = auth.user?.email || '';
  
  // Important: Make sure we properly detect the admin status
  // Include the specific email from auth logs
  const adminEmailPatterns = ['admin', 'test', 'josephkwantum@gmail.com'];
  const isAdminByEmail = adminEmailPatterns.some(pattern => 
    userEmail.toLowerCase().includes(pattern.toLowerCase()) || 
    userEmail.toLowerCase() === pattern.toLowerCase()
  );
  
  console.log('Auth check:', { 
    email: userEmail, 
    isAdminByEmail, 
    isAdminRoute,
    user: auth.user
  });
  
  // Create a compatible interface between the two auth systems
  return {
    ...auth,
    // Provide properties expected by components using context/AuthContext.tsx
    signIn: auth.login,
    signUp: async (email: string, password: string) => {
      // In the future, this could be modified to create initial user profile data
      return auth.login(email, password);
    },
    signOut: auth.logout,
    resetPassword: async (email: string) => {
      console.log('Password reset requested for:', email);
      // This would need to be implemented in the AuthProvider
    },
    loading: false, // Add loading state expected by components
    // Use existing properties from providers/AuthProvider
    roles: auth.user?.roles || ['agent'],
    activeRole: isAdminRoute ? 'admin' : 'agent',
  };
};
