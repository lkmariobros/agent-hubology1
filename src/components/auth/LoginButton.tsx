
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSignIn = async () => {
    try {
      setLoading(true);
      // This is just a demo - in a real app, you'd have a proper login form
      await signIn('demo@example.com', 'password123');
      navigate('/dashboard');
      toast.success('Signed in as demo user');
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Failed to sign in with demo account');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
      onClick={handleSignIn}
    >
      {loading ? 'Signing in...' : 'Sign In'}
    </Button>
  );
};

export default LoginButton;
