-- Add a policy to allow anonymous access for testing
CREATE POLICY "Allow anonymous access for testing"
    ON public.profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify the policy was created
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
