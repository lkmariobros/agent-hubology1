
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from 'lucide-react';

interface AuthFormProps {
  onClose?: () => void;
}

const AuthForm = ({ onClose }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would connect to an authentication service
    console.log('Submitting:', { email, password, isLogin });
    
    // Simulate authentication
    if (isLogin) {
      // Navigate to dashboard (would happen after successful login)
      window.location.href = '/dashboard';
    } else {
      // Switch to login mode after registration
      setIsLogin(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="relative w-full max-w-md glass-card rounded-xl p-8 shadow-2xl">
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
        
        <div className="mb-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-1">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isLogin 
              ? 'Enter your credentials to login to your account.' 
              : 'Enter your details to create your account.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-white/10 focus-visible:ring-accent"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <button type="button" className="text-xs text-accent hover:text-accent/80 transition-colors">
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
              className="bg-background/50 border-white/10 focus-visible:ring-accent"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-white transition-all"
          >
            {isLogin ? 'Sign in' : 'Create an account'}
          </Button>
        </form>
        
        <div className="mt-6 flex items-center justify-center">
          <Separator className="flex-1 bg-white/10" />
          <span className="mx-2 text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1 bg-white/10" />
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 border-white/10 hover:bg-white/5 text-white transition-all"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Create an account' : 'Sign in'}
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
