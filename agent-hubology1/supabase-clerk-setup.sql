-- Supabase Setup Script for Agent Hubology with Clerk Integration
-- Run this in the SQL Editor of your Supabase project

-- Create a table for user profiles that works with Clerk
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  clerk_id TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: With Clerk, we don't use the trigger on auth.users
-- Instead, we'll create profiles manually or through your application
-- when users authenticate with Clerk

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Clerk JWT authentication
-- These policies use auth.jwt() instead of auth.uid()
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.jwt() ->> 'sub' = clerk_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.jwt() ->> 'sub' = clerk_id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'
    )
  );

-- Admin can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'
    )
  );

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'sub' AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for easier role checking
CREATE OR REPLACE VIEW public.user_roles AS
SELECT 
  id,
  clerk_id,
  email,
  role,
  role = 'admin' AS is_admin
FROM public.profiles;

-- Create a table for agent-specific data
CREATE TABLE public.agents (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  agent_code TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on agents table
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Agents can view and update their own data
CREATE POLICY "Agents can view their own data"
  ON public.agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = agents.profile_id AND profiles.clerk_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Agents can update their own data"
  ON public.agents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = agents.profile_id AND profiles.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Admins can view and update all agent data
CREATE POLICY "Admins can view all agent data"
  ON public.agents FOR SELECT
  USING (public.user_has_role('admin'));

CREATE POLICY "Admins can update all agent data"
  ON public.agents FOR UPDATE
  USING (public.user_has_role('admin'));

CREATE POLICY "Admins can insert agent data"
  ON public.agents FOR INSERT
  WITH CHECK (public.user_has_role('admin'));

-- Create a table for admin-specific data
CREATE TABLE public.admins (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  admin_level TEXT DEFAULT 'standard',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can access the admins table
CREATE POLICY "Only admins can view admin data"
  ON public.admins FOR SELECT
  USING (public.user_has_role('admin'));

CREATE POLICY "Only admins can update admin data"
  ON public.admins FOR UPDATE
  USING (public.user_has_role('admin'));

-- Create a function to create a profile for a Clerk user
CREATE OR REPLACE FUNCTION public.create_profile_for_clerk_user(
  p_clerk_id TEXT,
  p_email TEXT,
  p_first_name TEXT DEFAULT '',
  p_last_name TEXT DEFAULT '',
  p_role TEXT DEFAULT 'agent'
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Generate a new UUID
  new_id := gen_random_uuid();
  
  -- Insert the profile
  INSERT INTO public.profiles (id, clerk_id, email, first_name, last_name, role)
  VALUES (new_id, p_clerk_id, p_email, p_first_name, p_last_name, p_role);
  
  -- Return the new UUID
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to promote a user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Get the profile ID from the email
  SELECT id INTO profile_id FROM public.profiles WHERE email = user_email;
  
  -- Update the user's role to admin
  UPDATE public.profiles SET role = 'admin' WHERE id = profile_id;
  
  -- Insert a record into the admins table if it doesn't exist
  INSERT INTO public.admins (id, profile_id)
  VALUES (gen_random_uuid(), profile_id)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to demote an admin to agent
CREATE OR REPLACE FUNCTION public.demote_to_agent(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Get the profile ID from the email
  SELECT id INTO profile_id FROM public.profiles WHERE email = user_email;
  
  -- Update the user's role to agent
  UPDATE public.profiles SET role = 'agent' WHERE id = profile_id;
  
  -- Remove the record from the admins table
  DELETE FROM public.admins WHERE profile_id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's profile
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.profiles
  WHERE clerk_id = auth.jwt() ->> 'sub';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
