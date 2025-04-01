
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
    const { p_approval_id, p_comment } = await req.json()
    
    // Get user from auth context
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    
    if (userError) throw userError
    if (!user) throw new Error('Unauthorized')
    
    // Insert the comment
    const { data, error } = await supabase
      .from('approval_comments')
      .insert({
        approval_id: p_approval_id,
        created_by: user.id,
        comment_text: p_comment
      })
      .select()
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({
        success: true,
        comment_id: data[0].id,
        message: 'Comment added successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error adding comment:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
