// Simple Node.js script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const SUPABASE_URL = 'https://twttyqbqhlgyzntcblbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTc5MDQsImV4cCI6MjA0OTIzMzkwNH0.u8veRmBirnompCeo3Bzgn9TzNqm6VD7NGAiOmwWcP_4';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Simple query to test the connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact' })
      .limit(0);
    
    if (error) {
      throw error;
    }
    
    console.log('Connection successful!');
    console.log('Data:', data);
    return true;
  } catch (error) {
    console.error('Connection failed!');
    console.error('Error:', error.message);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('Your Supabase connection is working properly!');
    } else {
      console.log('There was an issue connecting to Supabase. Please check your credentials and try again.');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });
