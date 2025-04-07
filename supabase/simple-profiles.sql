-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects if they exist to avoid conflicts
DROP FUNCTION IF EXISTS public.get_my_profile();
DROP FUNCTION IF EXISTS public.create_profile_for_clerk_user(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.check_profile_exists(TEXT);
DROP TABLE IF EXISTS public.profiles;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'agent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RPC function to get current user's profile
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT *
    FROM public.profiles
    WHERE clerk_id = auth.uid()::text
    LIMIT 1;
$$;

-- Create RPC function to create a profile for a Clerk user
CREATE OR REPLACE FUNCTION public.create_profile_for_clerk_user(
    p_clerk_id TEXT,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT DEFAULT 'agent'
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create RPC function to check if a profile exists
CREATE OR REPLACE FUNCTION public.check_profile_exists(
    p_clerk_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM public.profiles
        WHERE clerk_id = p_clerk_id
    ) INTO v_exists;
    
    RETURN v_exists;
END;
$$;

-- Create Row Level Security policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read their own profile"
    ON public.profiles
    FOR SELECT
    USING (clerk_id = auth.uid()::text);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (clerk_id = auth.uid()::text);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (clerk_id = auth.uid()::text);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_for_clerk_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_profile_exists TO authenticated;

-- Insert a test profile
INSERT INTO public.profiles (clerk_id, email, first_name, last_name, role)
VALUES 
    ('test_user_1', 'test1@example.com', 'Test', 'User', 'agent'),
    ('test_user_2', 'test2@example.com', 'Admin', 'User', 'admin')
ON CONFLICT (clerk_id) DO NOTHING;
