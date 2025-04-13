# Production Security Hardening Guide

This guide provides specific SQL commands to properly secure your Supabase resources for production use with Clerk JWT integration. The simplified policies we created for testing should be replaced with these more secure versions before going to production.

## 1. Storage Policies Hardening

Replace the simplified "Anyone can..." policies with these more secure versions:

```sql
-- Drop simplified testing policies
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects';
EXCEPTION WHEN OTHERS THEN
    -- Ignore errors
END;
$$;

-- Create production-ready policies for property-images bucket
DO $$
BEGIN
    -- Public read access remains unchanged (if needed)
    EXECUTE $POLICY$
    CREATE POLICY "Public can read all images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'property-images');
    $POLICY$;
    
    -- Secured upload policy
    EXECUTE $POLICY$
    CREATE POLICY "Authenticated users can upload images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images' AND (
            auth.role() = 'authenticated' OR
            auth.jwt() ->> 'role' = 'authenticated' OR
            auth.jwt() ->> 'user_id' IS NOT NULL
        )
    );
    $POLICY$;
    
    -- Secured update policy with folder checks
    EXECUTE $POLICY$
    CREATE POLICY "Users can only update their own images"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'property-images' AND (
            -- Classic Supabase Auth owner check
            auth.uid() = owner OR
            -- Clerk JWT folder ownership check
            (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
            -- Admin check via safe function
            public.check_admin_by_clerk_id(auth.jwt() ->> 'user_id')
        )
    );
    $POLICY$;
    
    -- Secured delete policy with folder checks
    EXECUTE $POLICY$
    CREATE POLICY "Users can only delete their own images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'property-images' AND (
            -- Classic Supabase Auth owner check
            auth.uid() = owner OR
            -- Clerk JWT folder ownership check
            (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
            -- Admin check via safe function
            public.check_admin_by_clerk_id(auth.jwt() ->> 'user_id')
        )
    );
    $POLICY$;
END;
$$;
```

## 2. Safe Admin Check Function

Ensure this helper function exists to prevent infinite recursion:

```sql
-- Create a secure admin check function
CREATE OR REPLACE FUNCTION public.check_admin_by_clerk_id(user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin_role BOOLEAN;
BEGIN
    -- Direct query without going through RLS
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE clerk_id = user_clerk_id AND role = 'admin'
    ) INTO is_admin_role;
    
    RETURN COALESCE(is_admin_role, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_admin_by_clerk_id(TEXT) TO authenticated;
```

## 3. Secure Notification Helper Functions

Replace any test functions with these production-ready versions:

```sql
-- Function to safely view user notifications
CREATE OR REPLACE FUNCTION public.safe_view_user_notifications(clerk_id_param TEXT)
RETURNS SETOF notifications AS $$
BEGIN
    -- Validate input parameter
    IF clerk_id_param IS NULL OR clerk_id_param = '' THEN
        RAISE EXCEPTION 'Invalid clerk_id parameter';
    END IF;

    -- Return user's notifications with limit
    RETURN QUERY
    SELECT *
    FROM notifications
    WHERE 
        clerk_id = clerk_id_param
    ORDER BY created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely create a notification
CREATE OR REPLACE FUNCTION public.safe_insert_notification(
    clerk_id_param TEXT,
    title_param TEXT,
    message_param TEXT,
    type_param TEXT DEFAULT 'system',
    data_param JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_id UUID := gen_random_uuid();
BEGIN
    -- Validate input parameters
    IF clerk_id_param IS NULL OR clerk_id_param = '' THEN
        RAISE EXCEPTION 'Invalid clerk_id parameter';
    END IF;
    
    IF title_param IS NULL OR title_param = '' THEN
        RAISE EXCEPTION 'Title cannot be empty';
    END IF;
    
    IF message_param IS NULL OR message_param = '' THEN
        RAISE EXCEPTION 'Message cannot be empty';
    END IF;

    -- Insert the notification
    INSERT INTO notifications (
        id,
        type,
        title,
        message,
        clerk_id,
        data,
        read,
        created_at
    ) VALUES (
        new_id,
        type_param,
        title_param,
        message_param,
        clerk_id_param,
        data_param,
        false,
        NOW()
    );
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely mark notification as read
CREATE OR REPLACE FUNCTION public.safe_mark_notification_read(
    notification_id_param UUID,
    clerk_id_param TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    affected_rows INT;
BEGIN
    -- Validate input parameters
    IF notification_id_param IS NULL THEN
        RAISE EXCEPTION 'Invalid notification ID';
    END IF;
    
    IF clerk_id_param IS NULL OR clerk_id_param = '' THEN
        RAISE EXCEPTION 'Invalid clerk_id parameter';
    END IF;

    -- Update notification if it belongs to the user
    UPDATE notifications
    SET read = true
    WHERE 
        id = notification_id_param AND
        clerk_id = clerk_id_param
    RETURNING 1 INTO affected_rows;
    
    RETURN COALESCE(affected_rows, 0) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.safe_view_user_notifications(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_insert_notification(TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_mark_notification_read(UUID, TEXT) TO authenticated;
```

## 4. Test SQL Commands for Verifying Security

Use these commands to verify your security settings:

```sql
-- Check storage policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects';

-- Check notification policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'notifications';

-- Check admin function
SELECT 
    proname, 
    prosecdef AS is_security_definer
FROM pg_proc 
WHERE proname LIKE '%admin%';

-- Check for SECURITY DEFINER helper functions
SELECT 
    proname, 
    prosecdef AS is_security_definer
FROM pg_proc 
WHERE prosecdef = true;
```

## 5. Frontend Production Pattern

Update frontend components with this pattern for production use:

```typescript
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// Safe notification component pattern
const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken, userId } = useAuth();

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get JWT token with proper error handling
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        throw new Error('Authentication token unavailable');
      }
      
      // Set token for Supabase request
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      // Use secure helper function
      const { data, error: supaError } = await supabase.rpc('safe_view_user_notifications', {
        clerk_id_param: userId
      });
      
      if (supaError) throw supaError;
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(error.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component
};
```

## 6. Security Best Practices

1. **Folder Structure**: For uploaded files, always use a folder structure that includes the user's Clerk ID:
   ```
   /property-images/{clerk_id}/filename.jpg
   ```

2. **JWT Token Storage**: Never store JWT tokens in localStorage, always obtain fresh tokens:
   ```typescript
   const token = await getToken({ template: 'supabase' });
   ```

3. **Error Handling**: Always implement proper error handling and never expose database errors to users:
   ```typescript
   try {
     // Code that might fail
   } catch (error) {
     console.error('Internal error:', error);
     // Show user-friendly message without technical details
     alert('Something went wrong. Please try again later.');
   }
   ```

4. **Input Validation**: Always validate inputs on both client and server:
   ```typescript
   // Client-side
   if (!userId) {
     setError("User ID is required");
     return;
   }
   
   // Server-side (SQL function)
   IF clerk_id_param IS NULL OR clerk_id_param = '' THEN
     RAISE EXCEPTION 'Invalid clerk_id parameter';
   END IF;
   ```

By following these hardening steps, your application will be secure for production use with Clerk JWT integration.