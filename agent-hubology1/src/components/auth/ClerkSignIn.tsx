import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ClerkSignInProps {
  redirectUrl?: string;
  afterSignInUrl?: string;
}

const ClerkSignIn: React.FC<ClerkSignInProps> = ({ 
  redirectUrl = '/dashboard',
  afterSignInUrl = '/dashboard'
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
          <CardTitle className="text-2xl font-bold text-white">Sign in</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your agent portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            redirectUrl={redirectUrl}
            afterSignInUrl={afterSignInUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkSignIn;
