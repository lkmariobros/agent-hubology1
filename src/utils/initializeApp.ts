
import { initializeStorage } from '@/integrations/supabase/storage';

/**
 * Initialize the application
 * This function is called when the app starts
 */
export const initializeApp = async () => {
  try {
    // Initialize storage buckets
    if (window.location.hostname !== 'localhost') {
      await initializeStorage();
    }

    // Add other initialization tasks here
    
    console.log('App initialization completed successfully');
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
};
