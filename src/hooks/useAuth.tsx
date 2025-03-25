
// Export the useAuth hook from our AuthContext
import { useAuth as useAuthFromContext } from '@/context/AuthContext';

// Extend the useAuth hook to include additional role-related functionality
export const useAuth = () => {
  const auth = useAuthFromContext();
  
  // Add role checking capability
  return {
    ...auth,
    isAdmin: auth.user?.email ? 
      ['admin@example.com', 'admin@propertypro.com', 'admin', 'test'].some(pattern => 
        auth.user?.email?.toLowerCase().includes(pattern.toLowerCase())
      ) : false,
    roles: auth.user ? ['agent'] : [],
    activeRole: 'agent',
    switchRole: (role: 'agent' | 'admin') => {
      console.log(`Switching to ${role} role`);
      // In the current implementation, we redirect based on role
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }
  };
};
