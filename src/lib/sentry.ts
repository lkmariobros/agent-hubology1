
import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn = "https://ca140a22d2c0617d9c0eb3b996fa799f@o4509071816523776.ingest.us.sentry.io/4509071846014976";
  
  // Initialize Sentry with environment-appropriate settings
  Sentry.init({
    dsn: dsn,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing({
        // Trace sampling based on environment
        tracePropagationTargets: [
          'localhost', 
          /^https:\/\/synabhmsxsvsxkyzhfss\.supabase\.co/,
          /^https:\/\/yourdomain\.com/
        ],
      }),
      // Enable performance monitoring
      new Sentry.Replay({
        maskAllText: import.meta.env.PROD, // Mask text in production only
        blockAllMedia: true,
      }),
    ],
    // Production-appropriate sampling rates
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysOnErrorSampleRate: import.meta.env.PROD ? 1.0 : 1.0,
    
    // Always enabled
    enabled: true,
    
    // Debug mode only in development
    debug: import.meta.env.DEV,
    
    // Only log to console in development
    beforeSend(event) {
      if (import.meta.env.DEV) {
        console.log('Sending event to Sentry:', event);
      }
      return event;
    }
  });
  
  // Log initialization only in development
  if (import.meta.env.DEV) {
    console.log('Sentry initialized in', import.meta.env.MODE, 'mode with DSN:', dsn);
  }
}

// Helper function to capture exceptions with Sentry
export const captureException = (error: unknown, context?: Record<string, any>) => {
  // Only log to console in development
  if (import.meta.env.DEV) {
    console.error('Error captured:', error);
  }
  
  Sentry.captureException(error, {
    contexts: {
      custom: context || {},
    },
  });
  
  if (import.meta.env.DEV) {
    console.log('Exception sent to Sentry');
  }
};
