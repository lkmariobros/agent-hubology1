
import { useAuth as useAuthFromContext } from '@/context/AuthContext';

// List of admin email patterns
const ADMIN_EMAILS = [
  'admin@example.com',
  'admin@propertypro.com', 
  'josephkwantum@gmail.com',
  'admin',
  'test'
];

// Extend the useAuth hook to include additional role-related functionality
export const useAuth = () => {
  const auth = useAuthFromContext();
  
  // Add role checking capability with better null safety
  const isAdmin = auth.user?.email ? 
    ADMIN_EMAILS.some(pattern => 
      auth.user?.email?.toLowerCase().includes(pattern.toLowerCase())
    ) : false;
  
  return {
    ...auth,
    isAdmin,
    roles: auth.user ? ['agent', ...(isAdmin ? ['admin'] : [])] : [],
    activeRole: window.location.pathname.startsWith('/admin') ? 'admin' : 'agent',
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
