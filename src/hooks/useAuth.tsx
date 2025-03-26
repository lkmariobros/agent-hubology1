
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
// Import the useAuthContext hook instead of directly using AuthContext
import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

/**
 * Enhanced authentication hook that extends the base auth context
 * with additional routing and role-related functionality.
 */
export const useAuth = () => {
  const auth = useAuthContext(); // Use the hook that's properly exported
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if the current route is in the admin section
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  /**
   * Switches the user role and navigates to the appropriate section
   */
  const switchRole = (role: UserRole) => {
    // Update role in auth context
    auth.switchRole(role);
    
    // Navigate based on the role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };
  
  return {
    ...auth,
    activeRole: isAdminRoute ? 'admin' : 'agent',
    switchRole
  };
};
