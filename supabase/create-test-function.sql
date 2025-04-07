-- Create a function to insert test profiles that bypasses RLS
CREATE OR REPLACE FUNCTION public.create_test_profile(
    p_clerk_id TEXT,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT DEFAULT 'agent'
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER  -- This makes the function run with the privileges of the creator
SET search_path = public
AS $$
DECLARE
    v_profile public.profiles;
BEGIN
    -- Insert the profile if it doesn't exist, otherwise update it
    INSERT INTO public.profiles (clerk_id, email, first_name, last_name, role)
    VALUES (p_clerk_id, p_email, p_first_name, p_last_name, p_role)
    ON CONFLICT (clerk_id) 
    DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        updated_at = NOW()
    RETURNING * INTO v_profile;
    
    RETURN v_profile;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_test_profile TO anon;
GRANT EXECUTE ON FUNCTION public.create_test_profile TO authenticated;
