
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LoaderCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const invitationSignupSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
  confirmPassword: z.string(),
  invitationCode: z.string().min(6, {
    message: 'Please enter a valid invitation code',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type InvitationSignupValues = z.infer<typeof invitationSignupSchema>;

export default function AgentInvitationSignup() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [isValidCode, setIsValidCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract the invitation code from URL query parameters
  const invitationCode = searchParams.get('code') || '';
  
  // Set up form with default values
  const form = useForm<InvitationSignupValues>({
    resolver: zodResolver(invitationSignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      invitationCode,
    },
  });
  
  // Verify invitation code when component loads or code changes
  useEffect(() => {
    if (invitationCode) {
      verifyInvitationCode(invitationCode);
    }
  }, [invitationCode]);
  
  // Verify the invitation code against the database
  const verifyInvitationCode = async (code: string) => {
    setIsVerifying(true);
    
    try {
      const { data, error } = await supabase
        .from('agent_invitations')
        .select('*')
        .eq('invitation_code', code)
        .eq('status', 'pending')
        .single();
        
      if (error) throw error;
      
      if (data) {
        setInvitation(data);
        setIsValidCode(true);
        form.setValue('email', data.email);
      } else {
        setIsValidCode(false);
        toast.error('Invalid or expired invitation code');
      }
    } catch (error) {
      console.error('Error verifying invitation code:', error);
      setIsValidCode(false);
      toast.error('Failed to verify invitation code');
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: InvitationSignupValues) => {
    if (!isValidCode || !invitation) {
      toast.error('Invalid invitation code');
      return;
    }
    
    try {
      // Register the new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${invitation.first_name} ${invitation.last_name}`,
            invitation_id: invitation.id
          }
        }
      });
      
      if (authError) throw authError;
      
      // Update the invitation status to accepted
      const { error: updateError } = await supabase
        .from('agent_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);
        
      if (updateError) throw updateError;
      
      // Set the upline_id for the new agent
      if (invitation.upline_id) {
        const { error: profileError } = await supabase
          .from('agent_profiles')
          .update({ upline_id: invitation.upline_id })
          .eq('id', authData.user?.id);
          
        if (profileError) throw profileError;
      }
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed: ' + (error.message || 'Unknown error'));
    }
  };
  
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
          <CardTitle className="text-2xl font-bold text-white">Agent Registration</CardTitle>
          <CardDescription className="text-gray-400">
            Complete your registration to join the team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isVerifying ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-white">Verifying invitation...</span>
            </div>
          ) : isValidCode && invitation ? (
            <div className="space-y-6">
              <div className="border rounded-md p-4 bg-muted/50 border-purple-800/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Invitation Verified</p>
                    <p className="text-sm text-gray-400">
                      You've been invited to join {invitation.upline_name || 'our agency'} as an agent.
                    </p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-black/50 border-gray-700 text-white opacity-60" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                              className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white"
                            />
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
                        <FormLabel className="text-white">Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                            className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="invitationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Invitation Code</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-black/50 border-gray-700 text-white opacity-60" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white transition-all"
                  >
                    Complete Registration
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-400">
                Please enter a valid invitation code to continue.
              </p>
              
              <Form {...form}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  verifyInvitationCode(form.getValues().invitationCode);
                }} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="invitationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Invitation Code</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter invitation code" 
                            className="bg-black/50 border-gray-700 focus-visible:ring-purple-600 text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Verify Code
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
          <p className="text-sm text-gray-400">
            Already have an account? <Button variant="link" className="p-0 text-purple-500 hover:text-purple-400" onClick={() => navigate('/login')}>Sign in</Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
