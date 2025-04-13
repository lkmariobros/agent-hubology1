# Clerk-Supabase Migration Guide

This document details the migration from Supabase Auth to Clerk Authentication while maintaining Supabase for database, storage, and realtime functionality. It provides a comprehensive overview of the changes made, implementation details, and best practices for production use.

## Migration Overview

### Migration Scope
- **Authentication**: Migrated from Supabase Auth to Clerk
- **Database Access**: Maintained with Supabase, accessed via Clerk JWT
- **Storage**: Updated policies to work with Clerk JWT
- **Notifications**: Modified to support both auth systems during transition

### Key Changes
1. **Profile Standardization**: Added `clerk_id` to profiles and related tables
2. **RLS Policies**: Updated to support authentication via JWT claims
3. **Storage Policies**: Modified for access control via Clerk JWT
4. **Helper Functions**: Created SECURITY DEFINER functions to bypass RLS when needed
5. **Testing Tools**: Implemented test pages for notifications and storage

## Implementation Details

### 1. JWT Integration

Clerk generates JWT tokens with custom claims that are validated by Supabase:

```typescript
// Get a Supabase JWT token from Clerk
const token = await getToken({ template: 'supabase' });

// Set the token for Supabase requests
supabase.auth.setSession({ access_token: token, refresh_token: '' });
```

The JWT template in Clerk must include:
- `user_id`: Maps to `clerk_id` in our database
- `role`: Set to 'authenticated' for RLS policies

### 2. Database Schema Updates

#### Profiles Table
```sql
-- Add clerk_id to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT;
CREATE INDEX IF NOT EXISTS profiles_clerk_id_idx ON public.profiles (clerk_id);
```

#### Notifications Table
```sql
-- Add clerk_id to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS clerk_id TEXT;
CREATE INDEX IF NOT EXISTS notifications_clerk_id_idx ON public.notifications (clerk_id);
```

### 3. RLS Policy Updates

#### User Access Policies
```sql
-- Example user access policy
CREATE POLICY "Users can view their own profiles"
ON public.profiles FOR SELECT
USING (
    id = auth.uid() OR 
    clerk_id = auth.jwt() ->> 'user_id'
);
```

#### Admin Access Policies
```sql
-- Function to check admin status safely
CREATE OR REPLACE FUNCTION public.check_admin_by_clerk_id(user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin_role BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE clerk_id = user_clerk_id AND role = 'admin'
    ) INTO is_admin_role;
    
    RETURN COALESCE(is_admin_role, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policy using the helper function
CREATE POLICY "Admin view profiles v4"
ON public.profiles FOR SELECT
USING (
    check_admin_by_clerk_id(auth.jwt() ->> 'user_id')
);
```

### 4. Storage Policy Updates

```sql
-- Storage policies for property-images bucket
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'property-images' AND (
        auth.jwt() ->> 'role' = 'authenticated' OR
        auth.role() = 'authenticated'
    )
);

CREATE POLICY "Owners can update their own images"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'property-images' AND (
        auth.uid() = owner OR
        (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
        public.storage_is_admin()
    )
);
```

### 5. Helper Functions

#### For Notifications
```sql
-- Safe function to view notifications
CREATE OR REPLACE FUNCTION public.safe_view_user_notifications(clerk_id_param TEXT)
RETURNS SETOF notifications AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM notifications
    WHERE 
        clerk_id = clerk_id_param
    ORDER BY created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe function to create notifications
CREATE OR REPLACE FUNCTION public.safe_insert_notification(
    clerk_id_param TEXT,
    title_param TEXT,
    message_param TEXT,
    type_param TEXT DEFAULT 'test'
)
RETURNS UUID AS $$
DECLARE
    new_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO notifications (
        id,
        type,
        title,
        message,
        clerk_id,
        read,
        created_at
    ) VALUES (
        new_id,
        type_param,
        title_param,
        message_param,
        clerk_id_param,
        false,
        NOW()
    );
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Production Implementation Guide

To implement these changes in production:

### 1. Database Migration Steps

1. **Create SQL Migration Files**:
   - Ensure all migrations are properly versioned (e.g., `20250415_update_notifications.sql`)
   - Include both "up" and "down" logic for rollbacks
   - Test migrations in a staging environment first

2. **Apply Migrations in Order**:
   - Start with `standardize_profiles.sql`
   - Then apply `update_notifications.sql`
   - Finally apply `update_storage_policies.sql`

3. **Verify Migration Success**:
   - Use the test pages to verify functionality
   - Check database structure with `\d table_name` in SQL editor
   - Verify policies with `SELECT * FROM pg_policies WHERE tablename = 'table_name'`

### 2. Safe Component Updates

When updating components to use the new Clerk JWT authentication:

1. **Use Safe Patterns**:
```typescript
// Get JWT token from Clerk
const token = await getToken({ template: 'supabase' });

// Set the token for the request
supabase.auth.setSession({ access_token: token, refresh_token: '' });

// Make database request
const { data, error } = await supabase.from('table_name').select('*');
```

2. **For Complex Operations Use Helper Functions**:
```typescript
// Example using a helper function
const { data, error } = await supabase.rpc('safe_view_user_notifications', {
  clerk_id_param: userId
});
```

3. **Handle Errors and Edge Cases**:
```typescript
try {
  const token = await getToken({ template: 'supabase' });
  
  if (!token) {
    throw new Error("No authentication token available");
  }
  
  // Set the token and proceed with request
} catch (error) {
  console.error('Authentication error:', error);
  // Show appropriate UI error
}
```

### 3. Security Considerations

1. **Use SECURITY DEFINER Functions Carefully**:
   - Only for operations that need to bypass RLS
   - Validate inputs thoroughly
   - Keep function logic simple and focused

2. **Implement Proper Error Handling**:
   - Never expose database errors directly to users
   - Log errors server-side for debugging
   - Provide user-friendly error messages

3. **Regular Security Audits**:
   - Review RLS policies regularly
   - Test access controls from different user contexts
   - Monitor Supabase logs for unauthorized access attempts

### 4. Performance Optimizations

1. **Optimize Helper Functions**:
   - Use appropriate indexes (clerk_id, user_id)
   - Limit result sets to reasonable sizes
   - Include proper WHERE clauses

2. **Use Efficient Patterns**:
   - Store the JWT token temporarily to avoid repeated getToken() calls
   - Use batched operations when possible
   - Implement proper pagination

## Testing Infrastructure

### Notification Test Infrastructure

We've created a comprehensive testing infrastructure for notifications:

1. **NotificationsRealtimeTest Component**:
   - Tests creating notifications
   - Tests reading notifications
   - Tests marking notifications as read
   - Tests realtime updates

2. **StorageTest Component**:
   - Tests file uploads with Clerk JWT
   - Tests file listing with Clerk JWT
   - Tests file deletion with Clerk JWT

These components are accessible at:
- `/notifications-test`
- `/storage-test`

## Common Issues and Solutions

### Infinite Recursion in Policies

**Problem**: RLS policies that reference themselves can cause infinite recursion.

**Solution**: Use SECURITY DEFINER functions to bypass RLS for admin checks:
```sql
CREATE OR REPLACE FUNCTION public.check_admin_by_clerk_id(user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin_role BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE clerk_id = user_clerk_id AND role = 'admin'
    ) INTO is_admin_role;
    
    RETURN COALESCE(is_admin_role, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### JWT Token Issues

**Problem**: JWT token not recognized or missing claims.

**Solution**: Verify Clerk JWT template configuration and token handling:
```typescript
// Debug JWT token claims
const token = await getToken({ template: 'supabase' });
console.log("Token available:", !!token);

// Check JWT claims in Supabase (SQL)
SELECT auth.jwt();
```

### RLS Policy Conflicts

**Problem**: Multiple policies creating confusing access rules.

**Solution**: Clear existing policies before creating new ones:
```sql
DROP POLICY IF EXISTS "Policy name" ON table_name;
```

## Conclusion

This migration allows for a modern authentication system with Clerk while maintaining the powerful database, storage, and realtime features of Supabase. By following these patterns and best practices, you can ensure a smooth transition and robust production implementation.

For any questions or issues, please contact the development team.