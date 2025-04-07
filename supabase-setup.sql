-- Supabase Setup Script for Agent Hubology
-- Run this in the SQL Editor of your Supabase project

-- Create a table for user profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (NEW.id, NEW.email, 'agent', '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for easier role checking
CREATE OR REPLACE VIEW public.user_roles AS
SELECT 
  id,
  email,
  role,
  role = 'admin' AS is_admin
FROM public.profiles;

-- Create a table for agent-specific data
CREATE TABLE public.agents (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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
  USING (auth.uid() = id);

CREATE POLICY "Agents can update their own data"
  ON public.agents FOR UPDATE
  USING (auth.uid() = id);

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
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- Create a function to promote a user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from the email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  -- Update the user's role to admin
  UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
  
  -- Insert a record into the admins table if it doesn't exist
  INSERT INTO public.admins (id)
  VALUES (user_id)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to demote an admin to agent
CREATE OR REPLACE FUNCTION public.demote_to_agent(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from the email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  -- Update the user's role to agent
  UPDATE public.profiles SET role = 'agent' WHERE id = user_id;
  
  -- Remove the record from the admins table
  DELETE FROM public.admins WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
