
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('demo@example.com');
  const [password, setPassword] = React.useState('password123');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For now just simulate a successful login
      setTimeout(() => {
        console.log('Login successful');
        toast.success('Successfully logged in');
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div 
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
      
      <Card className="w-full max-w-md relative z-10 bg-gray-900 border-gray-800 text-white">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold">PropertyPro</span>
          </div>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Button variant="link" className="px-0 text-xs text-gray-400 hover:text-gray-300">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-400 text-center">
            Don't have an account? <Button variant="link" className="px-0 text-purple-400 hover:text-purple-300">Create account</Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
