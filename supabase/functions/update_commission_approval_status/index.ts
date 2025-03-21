
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
    const { p_approval_id, p_new_status, p_notes } = await req.json()
    
    // Get the current status before updating
    const { data: currentApproval, error: fetchError } = await supabase
      .from('commission_approvals')
      .select('status, submitted_by')
      .eq('id', p_approval_id)
      .single()
    
    if (fetchError) throw fetchError
    
    const previousStatus = currentApproval.status
    
    // Use the RPC function to update status
    const { data, error } = await supabase.rpc('update_commission_approval_status', {
      p_approval_id,
      p_new_status,
      p_notes
    })
    
    if (error) throw error
    
    // Log the status change in history
    const { error: historyError } = await supabase
      .from('commission_approval_history')
      .insert({
        approval_id: p_approval_id,
        previous_status: previousStatus,
        new_status: p_new_status,
        notes: p_notes,
        changed_by: (await supabase.auth.getUser()).data.user?.id
      })
    
    if (historyError) {
      console.error('Failed to insert history record:', historyError)
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating approval status:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
