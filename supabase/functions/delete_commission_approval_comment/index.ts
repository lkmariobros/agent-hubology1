
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
    const { p_comment_id } = await req.json()
    
    // Get user from auth context
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    
    if (userError) throw userError
    if (!user) throw new Error('Unauthorized')
    
    // Verify the user owns this comment
    const { data: comment, error: commentError } = await supabase
      .from('approval_comments')
      .select('created_by')
      .eq('id', p_comment_id)
      .single()
    
    if (commentError) throw commentError
    
    // Check if the user is the comment owner or an admin
    const isAuthorized = comment.created_by === user.id
    
    if (!isAuthorized) {
      // Check if user is an admin (tier 5+)
      const { data: profile, error: profileError } = await supabase
        .from('agent_profiles')
        .select('tier')
        .eq('id', user.id)
        .single()
      
      if (profileError) throw profileError
      
      if (profile.tier < 5) {
        throw new Error('You are not authorized to delete this comment')
      }
    }
    
    // Delete the comment
    const { error } = await supabase
      .from('approval_comments')
      .delete()
      .eq('id', p_comment_id)
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comment deleted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting comment:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
