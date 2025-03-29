
/**
 * Application logging service
 * Used for consistent error tracking and monitoring in production
 */
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string | null;
  url?: string;
  component?: string;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxBufferSize = 50;
  private isProduction = import.meta.env.PROD;
  
  // Add a log entry
  log(
    level: LogEntry['level'], 
    message: string, 
    context?: Record<string, any>,
    component?: string
  ) {
    const entry: LogEntry = {
      level,
      message,
      context,
      component,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getCurrentUserId()
    };
    
    // Always log to console in development
    if (!this.isProduction) {
      this.logToConsole(entry);
    }
    
    // Add to buffer
    this.logs.push(entry);
    
    // Flush if needed
    if (this.logs.length >= this.maxBufferSize) {
      this.flush();
    }
    
    return entry;
  }
  
  // Log levels
  info(message: string, context?: Record<string, any>, component?: string) {
    return this.log('info', message, context, component);
  }
  
  warn(message: string, context?: Record<string, any>, component?: string) {
    return this.log('warn', message, context, component);
  }
  
  error(message: string, context?: Record<string, any>, component?: string) {
    return this.log('error', message, context, component);
  }
  
  debug(message: string, context?: Record<string, any>, component?: string) {
    return this.log('debug', message, context, component);
  }
  
  // Log to console during development
  private logToConsole(entry: LogEntry) {
    const { level, message, context, component } = entry;
    const prefix = component ? `[${component}]` : '';
    
    switch (level) {
      case 'info':
        console.info(`${prefix} ${message}`, context || '');
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, context || '');
        break;
      case 'error':
        console.error(`${prefix} ${message}`, context || '');
        break;
      case 'debug':
        console.debug(`${prefix} ${message}`, context || '');
        break;
    }
  }
  
  // Get current user ID if available
  private getCurrentUserId(): string | null {
    try {
      // Get from local storage or other source
      return localStorage.getItem('user-id');
    } catch (e) {
      return null;
    }
  }
  
  // Flush logs to the server
  async flush() {
    if (this.logs.length === 0) return;
    
    if (this.isProduction) {
      try {
        // In production, send logs to your logging service
        // Example with Supabase Edge Function:
        // await supabase.functions.invoke('log-events', { 
        //   body: { logs: this.logs } 
        // });
        
        // Clear the logs after successful send
        this.logs = [];
      } catch (error) {
        console.error('Failed to send logs to server', error);
      }
    } else {
      // In development, just clear the buffer
      this.logs = [];
    }
  }
}

// Create and export singleton instance
export const logger = new LoggingService();

// Export helpers for use in error boundaries
export const logError = (error: Error, componentStack?: string) => {
  logger.error(error.message, { 
    stack: error.stack,
    componentStack 
  }, 'ErrorBoundary');
};
