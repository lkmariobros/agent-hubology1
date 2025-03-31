
import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn = "https://0daa1b896105f2b8507f5b6783948871@o4509071816523776.ingest.us.sentry.io/4509071830810624";
  
  // Always initialize Sentry, but with different settings for dev/prod
  Sentry.init({
    dsn: dsn,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for transactions
        tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
      }),
      // Enable performance monitoring
      new Sentry.Replay({
        maskAllText: false, // Change to true in production
        blockAllMedia: true,
      }),
    ],
    // Always capture errors in development for testing
    // In production, use sampling to avoid hitting quota limits
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    
    // This ensures we always capture errors even in development
    enabled: true,
    
    // Debug mode to see what's happening with Sentry
    debug: import.meta.env.DEV,
    
    // Uncomment to see verbose logs during development
    beforeSend(event) {
      console.log('Sending event to Sentry:', event);
      return event;
    }
  });
  
  console.log('Sentry initialized in', import.meta.env.MODE, 'mode with DSN:', dsn);
}

// Helper function to capture exceptions with Sentry
export const captureException = (error: unknown, context?: Record<string, any>) => {
  console.error('Error captured:', error);
  
  // Always send to Sentry for testing purposes
  Sentry.captureException(error, {
    contexts: {
      custom: context || {},
    },
  });
  
  console.log('Exception sent to Sentry');
};
