
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
    
    // Check if the comment belongs to the user or user is admin
    const { data: comment, error: commentError } = await supabase
      .from('approval_comments')
      .select('created_by')
      .eq('id', p_comment_id)
      .single()
    
    if (commentError) throw commentError
    if (!comment) throw new Error('Comment not found')
    
    // Only allow deletion if the user created the comment or is an admin
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (comment.created_by !== user.id && !isAdmin) {
      throw new Error('You can only delete your own comments')
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
