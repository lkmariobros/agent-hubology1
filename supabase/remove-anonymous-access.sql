-- Remove the policy that allows anonymous access
DROP POLICY IF EXISTS "Allow anonymous access for testing" ON public.profiles;

-- Verify the policy was removed
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
