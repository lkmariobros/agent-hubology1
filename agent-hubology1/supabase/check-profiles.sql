-- Check if profiles table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'profiles'
) AS "profiles_table_exists";

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'profiles'
ORDER BY 
    ordinal_position;

-- Check if there are any profiles
SELECT COUNT(*) AS "profile_count" FROM public.profiles;

-- Check if RLS is enabled
SELECT 
    tablename, 
    rowsecurity
FROM 
    pg_tables
WHERE 
    schemaname = 'public' 
    AND tablename = 'profiles';

-- Check policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM 
    pg_policies
WHERE 
    schemaname = 'public' 
    AND tablename = 'profiles';

-- Check functions
SELECT 
    proname, 
    prosrc
FROM 
    pg_proc
WHERE 
    proname IN ('get_my_profile', 'create_profile_for_clerk_user', 'check_profile_exists')
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- List all profiles
SELECT * FROM public.profiles LIMIT 10;
