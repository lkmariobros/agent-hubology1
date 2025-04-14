import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';

const SimpleSignIn: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
                card: "bg-transparent shadow-none border-none",
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSignIn;
