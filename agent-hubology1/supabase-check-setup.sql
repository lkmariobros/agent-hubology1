-- Check if the profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) AS profiles_table_exists;

-- Check if the clerk_id column exists in the profiles table
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'profiles' 
  AND column_name = 'clerk_id'
) AS clerk_id_column_exists;

-- Check if the create_profile_for_clerk_user function exists
SELECT EXISTS (
  SELECT FROM pg_proc 
  WHERE proname = 'create_profile_for_clerk_user'
) AS create_profile_function_exists;

-- Check if the get_my_profile function exists
SELECT EXISTS (
  SELECT FROM pg_proc 
  WHERE proname = 'get_my_profile'
) AS get_my_profile_function_exists;

-- Check if the user_has_role function exists
SELECT EXISTS (
  SELECT FROM pg_proc 
  WHERE proname = 'user_has_role'
) AS user_has_role_function_exists;

-- Check if the is_admin function exists
SELECT EXISTS (
  SELECT FROM pg_proc 
  WHERE proname = 'is_admin'
) AS is_admin_function_exists;

-- Check RLS policies on the profiles table
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Check if RLS is enabled on the profiles table
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'profiles';

-- List all tables in the public schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
