import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ClerkSignUpProps {
  redirectUrl?: string;
  afterSignUpUrl?: string;
}

const ClerkSignUp: React.FC<ClerkSignUpProps> = ({ 
  redirectUrl = '/dashboard',
  afterSignUpUrl = '/dashboard'
}) => {
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
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Sign up to access the agent portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            redirectUrl={redirectUrl}
            afterSignUpUrl={afterSignUpUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkSignUp;
