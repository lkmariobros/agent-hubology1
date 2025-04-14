# Supabase Migration Instructions

This document provides step-by-step instructions for applying the database migrations to update your Supabase instance for Clerk JWT authentication.

## Overview of Migrations

We have created a series of migration scripts:

1. **20250415_standardize_profiles.sql**: Standardizes the profile tables and updates RLS policies
2. **20250415_update_notifications.sql**: Updates the notifications system to support clerk_id
3. **20250415_update_storage_policies.sql**: Updates storage policies for the new JWT claims

## Prerequisites

- Access to Supabase dashboard
- Admin privileges for your Supabase project
- A properly configured Clerk JWT template (see [CLERK_JWT_TEMPLATE_CONFIG.md](./CLERK_JWT_TEMPLATE_CONFIG.md))

## Migration Steps

### Step 1: Apply the Profile Standardization Migration

1. Go to the [Supabase dashboard](https://app.supabase.com/)
2. Select your project
3. Go to the "SQL Editor" in the left sidebar
4. Create a new query
5. Copy the contents of `supabase/migrations/20250415_standardize_profiles.sql`
6. Execute the SQL script
7. Verify that the profiles table has been created with the correct structure

### Step 2: Apply the Notifications Migration

1. In the SQL Editor, create a new query
2. Copy the contents of `supabase/migrations/20250415_update_notifications.sql`
3. Execute the SQL script
4. Verify that the notifications table has been updated with a clerk_id column

### Step 3: Apply the Storage Policies Migration

1. In the SQL Editor, create a new query
2. Copy the contents of `supabase/migrations/20250415_update_storage_policies.sql`
3. Execute the SQL script
4. Verify that the storage policies have been updated

### Step 4: Verify the Migrations

After applying all migrations, you should verify that they were applied correctly:

#### Check Tables and Columns

```sql
-- Check profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check notifications table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications';
```

#### Check RLS Policies

Navigate to "Authentication" > "Policies" in the Supabase dashboard and verify that:

1. The profiles table has the correct RLS policies
2. The notifications table has the correct RLS policies
3. The storage.objects table has the correct policies for each bucket

#### Check Storage Buckets

Navigate to "Storage" in the Supabase dashboard and verify that:

1. The property-images bucket exists
2. The property-documents bucket exists

### Step 5: Test the Authentication

1. Navigate to the `/basic-auth-test` route in your application
2. Test both anonymous and authenticated Supabase access
3. Verify that you can view and manage your notifications
4. Test file uploads to both buckets

## Troubleshooting

### Common Issues

1. **"Function already exists with same argument types"**:
   - Drop the specific function first using: `DROP FUNCTION IF EXISTS function_name(arg_type);`
   - Then run the migration again

2. **"Relation already exists"**:
   - This usually means you've already created a table or view
   - You can either drop it first or update the script to use IF NOT EXISTS

3. **"Permission denied for schema"**:
   - Make sure your Supabase user has the correct permissions
   - Check the error message for the specific schema mentioned

### Getting Help

If you encounter issues that you can't resolve, please:

1. Check the error message for specific details
2. Review the SQL scripts for any syntax errors
3. Make sure your Supabase project is properly configured
4. If needed, contact the development team for assistance

## Next Steps

After applying these migrations:

1. Update your frontend code to use the clerk_id for notifications
2. Test file uploads and downloads with the new authentication
3. Make sure all components that access Supabase data use the correct authentication method

For more details on how to use the new authentication system, see [DATABASE_SETUP.md](./DATABASE_SETUP.md).