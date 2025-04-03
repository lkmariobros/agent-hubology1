
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from './components/ui/sonner'
import { CLERK_PUBLISHABLE_KEY } from './config/clerk'

// Use the key from the config file
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// Make sure to log the key being used (without exposing it fully)
console.log(`Using Clerk with key starting with: ${CLERK_PUBLISHABLE_KEY.substring(0, 8)}...`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
      <Toaster />
    </ClerkProvider>
  </React.StrictMode>,
)
