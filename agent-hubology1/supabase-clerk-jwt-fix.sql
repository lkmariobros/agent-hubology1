-- Update the RLS policies to use the sub claim
CREATE OR REPLACE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.jwt() ->> 'sub' = clerk_id);

CREATE OR REPLACE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.jwt() ->> 'sub' = clerk_id);

-- Admin policies
CREATE OR REPLACE POLICY "Admins can view all profiles"
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'
    )
  );

CREATE OR REPLACE POLICY "Admins can update all profiles"
  ON public.profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'
    )
  );

-- Update the user_has_role function
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'sub' AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_my_profile function
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.profiles
  WHERE clerk_id = auth.jwt() ->> 'sub';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
