
import { useState } from 'react';
import { authService } from '../authService';
import { roleUtils } from '../roleUtils';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { AuthState } from '../types';

/**
 * Hook providing authentication methods
 */
export function useAuthMethods(
  state: AuthState,
  setLoading: (isLoading: boolean) => void,
  setError: (error: Error | null) => void,
  updateSessionState: (session: any, user: any, profile: any, roles: any, activeRole: any) => void
) {
  // Authentication methods
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signIn(email, password);
      // The auth state change listener will update the state
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Sign in failed'));
      setLoading(false);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signUp(email, password);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Sign up failed'));
      setLoading(false);
      throw error;
    }
  };
  
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      // The auth state change listener will reset the state
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Sign out failed'));
      setLoading(false);
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(email);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Password reset failed'));
      setLoading(false);
      throw error;
    }
  };
  
  // Role management methods
  const switchRole = (role: UserRole) => {
    roleUtils.switchRole(state.roles, role, (newRole) => {
      // Update state with new role
      const newState = {
        ...state,
        activeRole: newRole,
        user: state.user ? { ...state.user, activeRole: newRole } : null,
      };
      
      updateSessionState(
        newState.session,
        newState.user,
        newState.profile,
        newState.roles,
        newState.activeRole
      );
    });
  };
  
  const hasRole = (role: UserRole) => {
    // Special case for admin email
    if (role === 'admin' && state.user?.email === 'josephkwantum@gmail.com') {
      return true;
    }
    return roleUtils.hasRole(state.roles, role);
  };
  
  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    switchRole,
    hasRole
  };
}
