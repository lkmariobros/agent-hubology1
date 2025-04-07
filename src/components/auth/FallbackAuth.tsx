import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const FallbackAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      toast.success('Signed in successfully!');
      setIsLoading(false);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Sign In</h2>
        <p className="text-gray-400 mt-1">
          Enter your credentials to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-purple-400 hover:text-purple-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default FallbackAuth;
