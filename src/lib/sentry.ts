
/**
 * Sentry initialization and utility functions
 */

export function initSentry() {
  // In a real app, this would initialize Sentry
  console.log('Sentry initialized');
}

export function captureException(error: Error, context?: Record<string, any>) {
  // In a real app, this would send the error to Sentry
  console.error('Error captured for Sentry:', error, context);
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  // In a real app, this would send the message to Sentry
  console.log(`[Sentry ${level}]:`, message);
}
