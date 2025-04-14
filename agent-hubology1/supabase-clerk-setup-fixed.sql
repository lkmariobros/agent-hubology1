-- Complete Supabase setup script for Clerk integration
-- Run this in the SQL Editor of your Supabase project

-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'admin', 'team_leader', 'manager', 'finance', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles 
  FOR SELECT 
  USING (auth.jwt() ->> 'user_id' = clerk_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles 
  FOR UPDATE 
  USING (auth.jwt() ->> 'user_id' = clerk_id);

-- Admin policies
CREATE POLICY "Admins can view all profiles"
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
    )
  );

-- Create or replace the user_has_role function
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the get_my_profile function
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.profiles
  WHERE clerk_id = auth.jwt() ->> 'user_id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the create_profile_for_clerk_user function
CREATE OR REPLACE FUNCTION public.create_profile_for_clerk_user(
  p_clerk_id TEXT,
  p_email TEXT,
  p_first_name TEXT DEFAULT '',
  p_last_name TEXT DEFAULT '',
  p_role TEXT DEFAULT 'agent'
)
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  -- Insert the profile
  INSERT INTO public.profiles (clerk_id, email, first_name, last_name, role)
  VALUES (p_clerk_id, p_email, p_first_name, p_last_name, p_role)
  RETURNING id INTO v_profile_id;
  
  RETURN v_profile_id;
EXCEPTION
  WHEN unique_violation THEN
    -- If there's a unique violation, it means the profile already exists
    -- Get the existing profile ID
    SELECT id INTO v_profile_id FROM public.profiles WHERE clerk_id = p_clerk_id OR email = p_email;
    RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the promote_to_admin function
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update the user's role to admin
  UPDATE public.profiles SET role = 'admin' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the demote_to_agent function
CREATE OR REPLACE FUNCTION public.demote_to_agent(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update the user's role to agent
  UPDATE public.profiles SET role = 'agent' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_for_clerk_user TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_profile TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_role TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon, authenticated;
