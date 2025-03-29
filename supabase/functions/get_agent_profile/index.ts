
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
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
      { headers: { 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  try {
    // Execute SQL directly to avoid RLS recursion
    const { data, error } = await supabaseClient
      .from('agent_profiles')
      .select('*')
      .eq('id', user.id)
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
        data = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          tier: 5,
          tier_name: 'Administrator'
        };
      }
    }

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
