-- Migration: Update Storage Policies for Clerk JWT Integration
-- This migration updates storage bucket policies to support Clerk JWT authentication

-----------------------------------------------------------------------
-- STEP 1: Helper function to check if user is admin
-----------------------------------------------------------------------

-- Create or replace the is_admin function to use Clerk JWT
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Check admin status using both authentication methods for compatibility
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE 
      (clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin') OR
      (id = auth.uid() AND role = 'admin')
  );
END;
$$;

-----------------------------------------------------------------------
-- STEP 2: Update property-images bucket policies
-----------------------------------------------------------------------

-- Drop existing policies first to avoid conflicts
DO $$
BEGIN
    -- Only attempt to drop if the bucket exists
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'property-images'
    ) THEN
        -- Drop existing policies using dynamic SQL to avoid errors if they don't exist
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Public can read all images" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
        
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
        
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Owners can update their own images" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
        
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Owners can delete their own images" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
    END IF;
END $$;

-- Create the bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'property-images'
    ) THEN
        INSERT INTO storage.buckets (id, name)
        VALUES ('property-images', 'property-images');
    END IF;
END $$;

-- Create updated policies for property-images bucket
DO $$
BEGIN
    -- Only create policies if the bucket exists
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'property-images'
    ) THEN
        -- Public read access
        EXECUTE $POLICY$
        CREATE POLICY "Public can read all images"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = 'property-images');
        $POLICY$;
        
        -- Upload access using JWT and/or auth.role()
        EXECUTE $POLICY$
        CREATE POLICY "Authenticated users can upload images"
        ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'property-images' AND (
                auth.jwt() ->> 'role' = 'authenticated' OR
                auth.role() = 'authenticated'
            )
        );
        $POLICY$;
        
        -- Update access with owner check
        EXECUTE $POLICY$
        CREATE POLICY "Owners can update their own images"
        ON storage.objects
        FOR UPDATE
        USING (
            bucket_id = 'property-images' AND (
                auth.uid() = owner OR
                (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
                public.is_admin()
            )
        );
        $POLICY$;
        
        -- Delete access with owner check
        EXECUTE $POLICY$
        CREATE POLICY "Owners can delete their own images"
        ON storage.objects
        FOR DELETE
        USING (
            bucket_id = 'property-images' AND (
                auth.uid() = owner OR
                (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
                public.is_admin()
            )
        );
        $POLICY$;
    END IF;
END $$;

-----------------------------------------------------------------------
-- STEP 3: Update property-documents bucket policies
-----------------------------------------------------------------------

-- Drop existing policies first to avoid conflicts
DO $$
BEGIN
    -- Only attempt to drop if the bucket exists
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'property-documents'
    ) THEN
        -- Drop existing policies using dynamic SQL to avoid errors if they don't exist
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can read property documents" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
        
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
        
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Owners can update their own documents" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
        
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Owners can delete their own documents" ON storage.objects';
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors
        END;
    END IF;
END $$;

-- Create the bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'property-documents'
    ) THEN
        INSERT INTO storage.buckets (id, name)
        VALUES ('property-documents', 'property-documents');
    END IF;
END $$;

-- Create updated policies for property-documents bucket
DO $$
BEGIN
    -- Only create policies if the bucket exists
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'property-documents'
    ) THEN
        -- Authenticated read access
        EXECUTE $POLICY$
        CREATE POLICY "Authenticated users can read property documents"
        ON storage.objects
        FOR SELECT
        USING (
            bucket_id = 'property-documents' AND (
                auth.jwt() ->> 'role' = 'authenticated' OR
                auth.role() = 'authenticated'
            )
        );
        $POLICY$;
        
        -- Upload access using JWT and/or auth.role()
        EXECUTE $POLICY$
        CREATE POLICY "Authenticated users can upload documents"
        ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'property-documents' AND (
                auth.jwt() ->> 'role' = 'authenticated' OR
                auth.role() = 'authenticated'
            )
        );
        $POLICY$;
        
        -- Update access with owner check
        EXECUTE $POLICY$
        CREATE POLICY "Owners can update their own documents"
        ON storage.objects
        FOR UPDATE
        USING (
            bucket_id = 'property-documents' AND (
                auth.uid() = owner OR
                (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
                public.is_admin()
            )
        );
        $POLICY$;
        
        -- Delete access with owner check
        EXECUTE $POLICY$
        CREATE POLICY "Owners can delete their own documents"
        ON storage.objects
        FOR DELETE
        USING (
            bucket_id = 'property-documents' AND (
                auth.uid() = owner OR
                (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
                public.is_admin()
            )
        );
        $POLICY$;
    END IF;
END $$;

-----------------------------------------------------------------------
-- STEP 4: Grant permissions to functions
-----------------------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;