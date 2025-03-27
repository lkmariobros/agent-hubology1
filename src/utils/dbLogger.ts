
/**
 * Database operation logging utility
 * Provides consistent logging for database operations during development
 */

import { ENABLE_DB_LOGGING } from '../config';

type LogLevel = 'info' | 'warning' | 'error' | 'success';
type DbOperation = 'select' | 'insert' | 'update' | 'delete' | 'other';

interface LogOptions {
  level?: LogLevel;
  table?: string;
  operation?: DbOperation;
  showData?: boolean;
}

/**
 * Logs database operations with consistent formatting
 * Only logs when ENABLE_DB_LOGGING is true
 */
export const dbLogger = {
  /**
   * Log a database operation
   */
  log: (message: string, data?: any, options: LogOptions = {}) => {
    if (!ENABLE_DB_LOGGING) return;
    
    const { 
      level = 'info', 
      table = '', 
      operation = 'other',
      showData = true 
    } = options;
    
    const timestamp = new Date().toISOString();
    const prefix = `[DB:${table}:${operation}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`, showData && data ? data : '');
        break;
      case 'warning':
        console.warn(`${prefix} ${message}`, showData && data ? data : '');
        break;
      case 'success':
        console.log(`%c${prefix} ${message}`, 'color: green', showData && data ? data : '');
        break;
      case 'info':
      default:
        console.log(`${prefix} ${message}`, showData && data ? data : '');
    }
    
    return { timestamp, level, table, operation, message, data };
  },
  
  /**
   * Log an error during a database operation
   */
  error: (message: string, error: any, table = '', operation: DbOperation = 'other') => {
    if (!ENABLE_DB_LOGGING) return;
    
    dbLogger.log(message, error, { 
      level: 'error', 
      table, 
      operation, 
      showData: true 
    });
    
    // Log the error stack if available
    if (error?.stack) {
      console.error(error.stack);
    }
  },
  
  /**
   * Log a successful database operation
   */
  success: (message: string, data?: any, table = '', operation: DbOperation = 'other', showData = false) => {
    if (!ENABLE_DB_LOGGING) return;
    
    dbLogger.log(message, data, { 
      level: 'success', 
      table, 
      operation, 
      showData 
    });
  }
};
