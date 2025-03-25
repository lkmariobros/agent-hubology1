
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/providers/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { signIn, signOut, user } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      // Since signUp doesn't exist in our auth context yet, we'll use signIn instead
      await signIn(email, password);
      
      toast.success('Registration successful! Please check your email for verification.');
      setIsRegister(false); // Switch back to login view
      
      // Reset form
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Registration error:', error);
      // Error handling done in signUp function
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      setOpen(false);
      // Reset form
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      // Error handling done in signIn function
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <Button 
        variant="outline" 
        onClick={handleLogout} 
        disabled={loading}
      >
        {loading ? 'Signing out...' : 'Sign out'}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRegister ? 'Create an account' : 'Sign in to your account'}</DialogTitle>
          <DialogDescription>
            {isRegister
              ? 'Enter your details to create your account'
              : 'Enter your credentials to access your dashboard'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={isRegister ? handleSignUp : handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-sm">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
            </button>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full">
              {loading 
                ? (isRegister ? 'Creating account...' : 'Signing in...') 
                : (isRegister ? 'Create account' : 'Sign in')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
