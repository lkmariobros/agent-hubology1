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
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a policy that allows authenticated users to select profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (true);  -- Allow all authenticated users to view profiles

-- Create a policy that allows authenticated users to insert profiles
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);  -- Allow all authenticated users to insert profiles

-- Create a policy that allows authenticated users to update profiles
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (true);  -- Allow all authenticated users to update profiles

-- Grant necessary permissions
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
