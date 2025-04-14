
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const formSchema = z.object({
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Extract token from URL
  useEffect(() => {
    const errorType = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    if (errorType || errorCode) {
      setTokenError(errorDescription || 'Invalid or expired reset token');
    }
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) throw error;
      
      setIsCompleted(true);
      toast.success('Your password has been successfully reset');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(`Password reset failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-sm shadow-2xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">!</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Invalid Reset Link</CardTitle>
            <CardDescription className="text-gray-400">
              The password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-900/30 rounded-lg text-red-200 text-sm mb-4">
              {tokenError}
            </div>
            <Button 
              onClick={() => navigate('/forgot-password')} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Request a new reset link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-sm shadow-2xl border-none">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">
            {isCompleted 
              ? 'Your password has been reset successfully' 
              : 'Enter your new password below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCompleted ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-white">Your password has been successfully reset.</p>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Sign in with new password
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white pl-10"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white pl-10"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </span>
                  ) : (
                    'Reset password'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
