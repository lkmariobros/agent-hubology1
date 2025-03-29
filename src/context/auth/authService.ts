
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Authentication service containing core auth operations
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    console.log(`[AuthService] Attempting to sign in user: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('[AuthService] Sign in error:', error.message);
        toast.error(`Sign in failed: ${error.message}`);
        throw error;
      }
      
      console.log('[AuthService] Sign in successful');
      return data;
    } catch (error) {
      console.error('[AuthService] Sign in execution error:', error);
      throw error;
    }
  },
  
  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error('[AuthService] Sign up error:', error.message);
        toast.error(`Sign up failed: ${error.message}`);
        throw error;
      }
      
      toast.success('Sign up successful! Please verify your email.');
      return data;
    } catch (error) {
      console.error('[AuthService] Sign up execution error:', error);
      throw error;
    }
  },
  
  /**
   * Sign out the current user
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AuthService] Sign out error:', error.message);
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      console.log('[AuthService] Sign out successful');
    } catch (error) {
      console.error('[AuthService] Sign out execution error:', error);
      throw error;
    }
  },
  
  /**
   * Request password reset email
   */
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error('[AuthService] Reset password error:', error.message);
        toast.error(`Password reset failed: ${error.message}`);
        throw error;
      }
      
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('[AuthService] Reset password execution error:', error);
      throw error;
    }
  },
  
  /**
   * Get the current session
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  }
};
