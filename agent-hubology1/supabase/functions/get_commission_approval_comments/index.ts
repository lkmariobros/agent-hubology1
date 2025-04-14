
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
    const { p_approval_id } = await req.json()
    
    // Get comments for the approval
    const { data: comments, error: commentsError } = await supabase
      .from('approval_comments')
      .select(`
        id,
        approval_id,
        created_by,
        comment_text,
        created_at,
        profiles:created_by (
          full_name
        )
      `)
      .eq('approval_id', p_approval_id)
      .order('created_at', { ascending: true })
    
    if (commentsError) throw commentsError
    
    // Transform data to match expected format
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      approval_id: comment.approval_id,
      created_by: comment.created_by,
      user_name: comment.profiles?.full_name || null,
      comment: comment.comment_text,
      created_at: comment.created_at
    }))
    
    return new Response(
      JSON.stringify(transformedComments),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching comments:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
