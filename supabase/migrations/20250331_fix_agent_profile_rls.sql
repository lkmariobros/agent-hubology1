
-- This migration fixes the agent_profile RLS policy to avoid recursive RLS issues
-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.get_agent_profile_by_id(UUID);

-- Create a function to avoid recursive RLS policy issue
CREATE OR REPLACE FUNCTION public.get_agent_profile_by_id(user_id UUID)
RETURNS SETOF agent_profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * 
  FROM public.agent_profiles 
  WHERE id = user_id
$$;

-- Grant execute permission to the different roles
GRANT EXECUTE ON FUNCTION public.get_agent_profile_by_id TO anon;
GRANT EXECUTE ON FUNCTION public.get_agent_profile_by_id TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_agent_profile_by_id TO service_role;
