
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request parameters
    const { approvalId, installmentCount, startDate } = await req.json();

    if (!approvalId) {
      throw new Error('Approval ID is required');
    }

    console.log(`Generating payment schedule for approval ${approvalId}`);

    // Call the database function to generate the payment schedule
    const { data, error } = await supabase.rpc('generate_payment_schedule', {
      p_approval_id: approvalId,
      p_installment_count: installmentCount || null,
      p_start_date: startDate || null
    });

    if (error) {
      throw error;
    }

    console.log('Payment schedule generation result:', data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating payment schedule:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
