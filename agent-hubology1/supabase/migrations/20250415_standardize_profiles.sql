-- Standardize Profiles Implementation Migration
-- This script consolidates and standardizes our profile tables and RLS policies

-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------------------
-- STEP 1: Reset existing tables and functions to avoid conflicts
-----------------------------------------------------------------------

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_my_profile();
DROP FUNCTION IF EXISTS public.create_profile_for_clerk_user(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.check_profile_exists(TEXT);
DROP FUNCTION IF EXISTS public.get_agent_profile_by_id(UUID);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Store current profiles data if it exists (to migrate later)
DROP TABLE IF EXISTS public.temp_profiles_backup;
CREATE TABLE IF NOT EXISTS public.temp_profiles_backup AS
SELECT * FROM public.profiles WHERE 1=1;

-- Store current agent_profiles data if it exists (to migrate later)
DROP TABLE IF EXISTS public.temp_agent_profiles_backup;
CREATE TABLE IF NOT EXISTS public.temp_agent_profiles_backup AS
SELECT * FROM public.agent_profiles WHERE 1=1;

-----------------------------------------------------------------------
-- STEP 2: Create standardized profiles table
-----------------------------------------------------------------------

-- Drop existing profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create new consolidated profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT GENERATED ALWAYS AS (
      CASE 
        WHEN first_name IS NULL AND last_name IS NULL THEN NULL
        WHEN first_name IS NULL THEN last_name
        WHEN last_name IS NULL THEN first_name
        ELSE first_name || ' ' || last_name
      END
    ) STORED,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('agent', 'admin', 'team_leader', 'manager', 'finance', 'viewer')),
    tier INTEGER DEFAULT 1 NOT NULL,
    license_number TEXT,
    phone TEXT,
    specializations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-----------------------------------------------------------------------
-- STEP 3: Standard profile management functions
-----------------------------------------------------------------------

-- Create RPC function to get current user's profile using JWT approach
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT *
    FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'user_id'
    LIMIT 1;
$$;

-- Create function to get user profile by clerk_id (useful for admins)
CREATE OR REPLACE FUNCTION public.get_profile_by_clerk_id(p_clerk_id TEXT)
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT *
    FROM public.profiles
    WHERE clerk_id = p_clerk_id
    LIMIT 1;
$$;

-- Create RPC function to create a profile for a Clerk user
CREATE OR REPLACE FUNCTION public.create_profile_for_clerk_user(
    p_clerk_id TEXT,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT DEFAULT 'agent',
    p_avatar_url TEXT DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_profile public.profiles;
BEGIN
    -- Validate inputs
    IF p_clerk_id IS NULL OR p_email IS NULL THEN
        RAISE EXCEPTION 'Clerk ID and email are required';
    END IF;
    
    -- Validate role
    IF p_role NOT IN ('agent', 'admin', 'team_leader', 'manager', 'finance', 'viewer') THEN
        RAISE EXCEPTION 'Invalid role: %', p_role;
    END IF;
    
    -- Insert the profile if it doesn't exist, otherwise update it
    INSERT INTO public.profiles (clerk_id, email, first_name, last_name, role, avatar_url)
    VALUES (p_clerk_id, p_email, p_first_name, p_last_name, p_role, p_avatar_url)
    ON CONFLICT (clerk_id)
    DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
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

-- Create function to promote user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(
    p_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_updated BOOLEAN;
BEGIN
    -- Check if the requesting user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can promote users to admin';
    END IF;
    
    -- Update the user's role to admin
    UPDATE public.profiles
    SET role = 'admin'
    WHERE email = p_email
    RETURNING TRUE INTO v_updated;
    
    RETURN COALESCE(v_updated, FALSE);
END;
$$;

-- Create function to demote admin to agent
CREATE OR REPLACE FUNCTION public.demote_to_agent(
    p_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_updated BOOLEAN;
BEGIN
    -- Check if the requesting user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can demote users from admin';
    END IF;
    
    -- Update the user's role to agent
    UPDATE public.profiles
    SET role = 'agent'
    WHERE email = p_email
    RETURNING TRUE INTO v_updated;
    
    RETURN COALESCE(v_updated, FALSE);
END;
$$;

-- Create function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.user_has_role(
    required_role TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_has_role BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM public.profiles
        WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = required_role
    ) INTO v_has_role;

    RETURN COALESCE(v_has_role, FALSE);
END;
$$;

-----------------------------------------------------------------------
-- STEP 4: Set up Row Level Security
-----------------------------------------------------------------------

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read their own profile"
    ON public.profiles
    FOR SELECT
    USING (clerk_id = auth.jwt() ->> 'user_id');

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (clerk_id = auth.jwt() ->> 'user_id');

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (clerk_id = auth.jwt() ->> 'user_id');

-- Policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
        )
    );

-- Policy for admins to update all profiles
CREATE POLICY "Admins can update all profiles"
    ON public.profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
        )
    );

-----------------------------------------------------------------------
-- STEP 5: Ensure related tables use consistent JWT approach
-----------------------------------------------------------------------

-- Update RLS policy for enhanced_properties
DROP POLICY IF EXISTS "Owners or admins can update properties" ON public.enhanced_properties;
CREATE POLICY "Owners or admins can update properties" 
ON public.enhanced_properties 
FOR UPDATE 
USING (
  clerk_id = auth.jwt() ->> 'user_id' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin')
);

DROP POLICY IF EXISTS "Owners or admins can delete properties" ON public.enhanced_properties;
CREATE POLICY "Owners or admins can delete properties" 
ON public.enhanced_properties 
FOR DELETE 
USING (
  clerk_id = auth.jwt() ->> 'user_id' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin')
);

-----------------------------------------------------------------------
-- STEP 6: Grant permissions to authenticated users
-----------------------------------------------------------------------

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_by_clerk_id TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_for_clerk_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_profile_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_role TO authenticated;

-- Grant permission to admin functions only to authenticated users
GRANT EXECUTE ON FUNCTION public.promote_to_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.demote_to_agent TO authenticated;

-----------------------------------------------------------------------
-- STEP 7: Test function to verify authentication flow
-----------------------------------------------------------------------

-- Create function to test authentication
CREATE OR REPLACE FUNCTION public.get_auth_info()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id TEXT;
    _email TEXT;
    _role TEXT;
    _profile_exists BOOLEAN;
    _profile_id UUID;
    _result JSON;
BEGIN
    -- Extract user data from JWT
    _user_id := coalesce(
        nullif(auth.jwt() ->> 'user_id', ''),
        nullif(auth.jwt() ->> 'sub', '')
    );
    
    _email := coalesce(
        nullif(auth.jwt() ->> 'user_email', ''),
        nullif(auth.jwt() ->> 'email', '')
    );
    
    _role := coalesce(
        nullif(auth.jwt() ->> 'role', ''),
        'none'
    );
    
    -- Check if profile exists
    SELECT 
        TRUE, 
        id 
    INTO 
        _profile_exists, 
        _profile_id
    FROM public.profiles 
    WHERE clerk_id = _user_id
    LIMIT 1;
    
    -- Return auth data as JSON
    _result := json_build_object(
        'user_id', _user_id,
        'email', _email,
        'role', _role,
        'profile_exists', _profile_exists,
        'profile_id', _profile_id,
        'jwt_claims', auth.jwt(),
        'timestamp', now()
    );
    
    RETURN _result;
END;
$$;

-- Grant access to the auth info function for authenticated users only
GRANT EXECUTE ON FUNCTION public.get_auth_info() TO authenticated;

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

-----------------------------------------------------------------------
-- STEP 8: Migrate data from old tables if needed
-----------------------------------------------------------------------

-- Migrate data from old profiles table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'temp_profiles_backup') THEN
        INSERT INTO public.profiles (
            id, clerk_id, email, first_name, last_name, role, created_at, updated_at
        )
        SELECT 
            id, clerk_id, email, first_name, last_name, role, created_at, updated_at
        FROM public.temp_profiles_backup
        ON CONFLICT (clerk_id) DO NOTHING;
    END IF;
END $$;

-- Insert test users if needed (for development)
INSERT INTO public.profiles (clerk_id, email, first_name, last_name, role)
VALUES 
    ('test_user_1', 'test1@example.com', 'Test', 'Agent', 'agent'),
    ('test_user_2', 'test2@example.com', 'Test', 'Admin', 'admin')
ON CONFLICT (clerk_id) DO NOTHING;