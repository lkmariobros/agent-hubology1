
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data: { user } } = await supabaseClient.auth.getUser()
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  try {
    // Use the security definer function to avoid RLS recursion
    const { data, error } = await supabaseClient
      .rpc('get_agent_profile_by_id', { user_id: user.id })
      .single();
    
    // Special handling for admin
    if (user.email === 'josephkwantum@gmail.com') {
      console.log('Admin user detected:', user.email);
      // If profile exists, update it with admin tier
      if (data) {
        data.tier = 5;
        data.tier_name = 'Administrator';
      }
      // If no profile, create one with admin tier
      else {
        const fallbackData = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          tier: 5,
          tier_name: 'Administrator'
        };
        return new Response(
          JSON.stringify({ data: fallbackData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
