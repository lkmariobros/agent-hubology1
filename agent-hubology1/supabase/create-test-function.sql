-- Helper function to test Supabase connection
CREATE OR REPLACE FUNCTION get_server_timestamp()
RETURNS TIMESTAMPTZ
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;

-- Grant access to the function for all users
GRANT EXECUTE ON FUNCTION get_server_timestamp() TO authenticated, anon;

-- Create a typed function for testing JWT auth
CREATE OR REPLACE FUNCTION get_auth_info()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id TEXT;
  _email TEXT;
  _role TEXT;
  _result JSON;
BEGIN
  -- Extract user data from JWT
  _user_id := auth.uid()::TEXT;
  _email := coalesce(
    nullif(current_setting('request.jwt.claims', true)::json->>'user_email', ''),
    nullif(current_setting('request.jwt.claims', true)::json->>'email', '')
  );
  _role := coalesce(
    nullif(current_setting('request.jwt.claims', true)::json->>'role', ''),
    'none'
  );
  
  -- Return auth data as JSON
  _result := json_build_object(
    'user_id', _user_id,
    'email', _email,
    'role', _role,
    'jwt_claims', current_setting('request.jwt.claims', true)::json,
    'timestamp', now()
  );
  
  RETURN _result;
END;
$$;

-- Grant access to the auth info function for authenticated users only
GRANT EXECUTE ON FUNCTION get_auth_info() TO authenticated;