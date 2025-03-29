
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import useAuth from '@/hooks/useAuth';  // Updated import
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const handleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting demo login process');
      // This is just a demo - in a real app, you'd have a proper login form
      await signIn('demo@example.com', 'password123');
      // Auth state change listener will handle navigation
      console.log('Demo login request completed');
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Failed to sign in with demo account');
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
      {loading ? (
        <span className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </span>
      ) : 'Sign In'}
    </Button>
  );
};

export default LoginButton;
