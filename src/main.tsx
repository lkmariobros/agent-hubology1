
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Fallback demo key

// Log the configuration status for debugging
console.log(`Using Clerk with ${CLERK_PUBLISHABLE_KEY.startsWith('pk_test') ? 'TEST' : 'PRODUCTION'} key`);

// Check that the key exists (will use fallback if not provided)
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing CLERK_PUBLISHABLE_KEY - Check your environment variables");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
