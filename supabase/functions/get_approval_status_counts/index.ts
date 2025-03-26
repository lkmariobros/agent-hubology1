
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Get count for each status
    const { data: pendingCount, error: pendingError } = await supabase
      .from('commission_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Pending')
    
    const { data: underReviewCount, error: underReviewError } = await supabase
      .from('commission_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Under Review')
    
    const { data: approvedCount, error: approvedError } = await supabase
      .from('commission_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Approved')
    
    const { data: readyForPaymentCount, error: readyForPaymentError } = await supabase
      .from('commission_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Ready for Payment')
    
    const { data: paidCount, error: paidError } = await supabase
      .from('commission_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Paid')
    
    const { data: rejectedCount, error: rejectedError } = await supabase
      .from('commission_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Rejected')
    
    if (pendingError || underReviewError || approvedError || 
        readyForPaymentError || paidError || rejectedError) {
      throw new Error('Error fetching status counts')
    }
    
    const result = {
      pending: pendingCount?.length || 0,
      under_review: underReviewCount?.length || 0,
      approved: approvedCount?.length || 0,
      ready_for_payment: readyForPaymentCount?.length || 0,
      paid: paidCount?.length || 0,
      rejected: rejectedCount?.length || 0
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
