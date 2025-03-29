
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Attempting sign in with:', email);
      await signIn(email, password);
      // No need to manually navigate, the auth state change will trigger the useEffect
      console.log('Sign in successful');
    } catch (error) {
      console.error('Login error:', error);
      // Error handling already done in signIn function
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await signUp(email, password);
      setIsLogin(true); // Switch to login view
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling already done in signUp function
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      // Error handling already done in resetPassword function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 shadow-2xl w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">P</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-gray-400 text-sm">
          {isLogin 
            ? 'Enter your credentials to login to your account.' 
            : 'Enter your details to create your account.'}
        </p>
      </div>
      
      <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white">Password</Label>
            {isLogin && (
              <button 
                type="button" 
                className="text-xs text-purple-500 hover:text-purple-400 transition-colors"
                onClick={handleResetPassword}
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-all"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLogin ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            isLogin ? 'Sign in' : 'Create an account'
          )}
        </Button>
      </form>
      
      <div className="mt-6 flex items-center justify-center">
        <Separator className="flex-1 bg-gray-700" />
        <span className="mx-2 text-xs text-gray-400">OR</span>
        <Separator className="flex-1 bg-gray-700" />
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full mt-4 border-gray-700 hover:bg-gray-800 text-white transition-all"
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
      >
        {isLogin ? 'Create an account' : 'Sign in'}
      </Button>
    </div>
  );
};

export default AuthForm;
