
import * as Sentry from '@sentry/react';

export function initSentry() {
  // Only initialize Sentry in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      environment: import.meta.env.MODE,
      integrations: [
        new Sentry.BrowserTracing({
          // Set sampling rate for transactions
          // Lower in production for better performance
          tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
        }),
        // Enable performance monitoring
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance monitoring sampling rate
      // Adjust this in production (0.1 = 10% of transactions)
      tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
      // Session replay sample rate
      // Adjust this in production (0.1 = 10% of sessions)
      replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
      // Error sample rate for replays
      replaysOnErrorSampleRate: import.meta.env.DEV ? 1.0 : 0.5,
    });
    
    console.log('Sentry initialized in', import.meta.env.MODE, 'mode');
  } else {
    console.log('Sentry initialization skipped in development');
  }
}

// Helper function to capture exceptions with Sentry
export const captureException = (error: unknown, context?: Record<string, any>) => {
  console.error('Error captured:', error);
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: {
        custom: context || {},
      },
    });
  }
};
