
/**
 * Application configuration settings
 * Controls feature flags and environment-specific behaviors
 */

// Controls whether to use real Supabase data or mock data
// Can be overridden regardless of environment
export const USE_REAL_DATA = import.meta.env.VITE_USE_REAL_DATA === 'true' || import.meta.env.MODE === 'production';

// Enable detailed console logging for debugging database operations
export const ENABLE_DB_LOGGING = import.meta.env.VITE_ENABLE_DB_LOGGING === 'true' || import.meta.env.MODE === 'development';

// Toggle for development features
export const SHOW_DEV_TOOLS = import.meta.env.VITE_SHOW_DEV_TOOLS === 'true' || import.meta.env.MODE === 'development';

// Local storage keys
export const STORAGE_KEYS = {
  DATA_MODE: 'app_data_mode', // For toggling between mock/real data during development
  THEME: 'app_theme',
  USER_PREFERENCES: 'app_user_preferences',
};

// Temporarily access mock data mode from localStorage during development
export const getMockDataMode = (): boolean => {
  if (import.meta.env.MODE !== 'development') return false;
  
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
  if (import.meta.env.MODE !== 'development') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.DATA_MODE, useMock ? 'mock' : 'real');
  } catch (error) {
    console.warn('Could not save data mode to localStorage', error);
  }
};
