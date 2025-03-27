
/**
 * Application configuration settings
 * Controls feature flags and environment-specific behaviors
 */

// Controls whether to use real Supabase data or mock data
// Can be overridden regardless of environment
export const USE_REAL_DATA = process.env.VITE_USE_REAL_DATA === 'true' || process.env.NODE_ENV === 'production';

// Enable detailed console logging for debugging database operations
export const ENABLE_DB_LOGGING = process.env.VITE_ENABLE_DB_LOGGING === 'true' || process.env.NODE_ENV === 'development';

// Toggle for development features
export const SHOW_DEV_TOOLS = process.env.VITE_SHOW_DEV_TOOLS === 'true' || process.env.NODE_ENV === 'development';

// Local storage keys
export const STORAGE_KEYS = {
  DATA_MODE: 'app_data_mode', // For toggling between mock/real data during development
  THEME: 'app_theme',
  USER_PREFERENCES: 'app_user_preferences',
};

// Temporarily access mock data mode from localStorage during development
export const getMockDataMode = (): boolean => {
  if (process.env.NODE_ENV !== 'development') return false;
  
  try {
    const storedValue = localStorage.getItem(STORAGE_KEYS.DATA_MODE);
    return storedValue === 'mock';
  } catch (error) {
    // In case localStorage is not available
    return false;
  }
};

// Set mock data mode in localStorage (development only)
export const setMockDataMode = (useMock: boolean): void => {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.DATA_MODE, useMock ? 'mock' : 'real');
  } catch (error) {
    console.warn('Could not save data mode to localStorage', error);
  }
};
