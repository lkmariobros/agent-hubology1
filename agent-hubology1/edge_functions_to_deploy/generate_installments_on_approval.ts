
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { approvalId, transactionId } = await req.json();
    
    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing installment generation for transaction: ${transactionId}, approval: ${approvalId}`);
    
    // Call the existing generate_commission_installments function
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/generate_commission_installments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ transactionId })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from generate_commission_installments:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate installments',
          details: errorData
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await response.json();
    
    // Update the approval status to reflect installment generation
    const { error: updateError } = await supabase
      .from('commission_approvals')
      .update({ notes: `${result.count} installments generated on ${new Date().toISOString()}` })
      .eq('id', approvalId);
      
    if (updateError) {
      console.error('Error updating approval:', updateError);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${result.count} installments for transaction ${transactionId}`,
        installments: result.installments
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
