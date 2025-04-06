
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

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION public.get_agent_profile_by_id TO anon;
GRANT EXECUTE ON FUNCTION public.get_agent_profile_by_id TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_agent_profile_by_id TO service_role;
