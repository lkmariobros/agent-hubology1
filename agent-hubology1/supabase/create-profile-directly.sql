-- Replace these values with your actual Clerk user information
-- You can get your Clerk user ID from the debug page or Clerk dashboard
INSERT INTO public.profiles (clerk_id, email, first_name, last_name, role)
VALUES 
  ('YOUR_CLERK_USER_ID', 'YOUR_EMAIL', 'YOUR_FIRST_NAME', 'YOUR_LAST_NAME', 'agent')
ON CONFLICT (clerk_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify the profile was created
SELECT * FROM public.profiles;
