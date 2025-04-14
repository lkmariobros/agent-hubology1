-- Create a function that returns the server timestamp
-- This can be called without authentication
CREATE OR REPLACE FUNCTION public.get_server_timestamp()
RETURNS TIMESTAMPTZ
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;

-- Grant access to all users
GRANT EXECUTE ON FUNCTION public.get_server_timestamp() TO anon, authenticated;

-- Create a function that returns authentication information
-- This requires authentication
CREATE OR REPLACE FUNCTION public.get_auth_info()
RETURNS JSONB
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'user_id', auth.uid(),
    'jwt_claims', auth.jwt(),
    'role', current_user,
    'session', current_setting('request.jwt.claims', true)::jsonb
  );
$$;

-- Grant access to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_auth_info() TO authenticated;
