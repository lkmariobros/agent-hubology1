
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const ClerkAuthHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-background border-b">
      <div>
        <h1 className="text-xl font-bold">Property Agency System</h1>
      </div>
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-primary text-white px-4 py-2 rounded-md">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
};

export default ClerkAuthHeader;
