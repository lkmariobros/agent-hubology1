// Type declarations for Clerk global object
interface ClerkGlobal {
  signOut: () => Promise<void>;
}

declare global {
  interface Window {
    Clerk?: ClerkGlobal;
  }
}

export {};
