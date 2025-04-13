# Clerk to Supabase Migration Summary

## Overview

We have successfully migrated the authentication system from Supabase Auth to Clerk, while maintaining integration with Supabase for database and storage. This document summarizes the changes made and provides an overview of the new authentication flow.

## Key Changes

### 1. Authentication System

- **Previous**: Direct Supabase Auth using `auth.uid()`
- **New**: Clerk authentication with JWT tokens that Supabase validates

### 2. Database Structure

- **Profiles Table**: Standardized with `clerk_id` field linking to Clerk user IDs
- **Notifications Table**: Updated to support both `user_id` (legacy) and `clerk_id` (new)
- **RLS Policies**: Updated to check both `auth.uid()` and `auth.jwt() ->> 'user_id'` for backward compatibility

### 3. Storage Policies

- **Access Control**: Updated to check JWT claims for authentication
- **Owner Identification**: Now supports both direct owner IDs and folder-based identification using clerk_id

## Migration Scripts

We've created the following migration scripts:

1. **20250415_standardize_profiles.sql**
   - Standardized profiles table structure
   - Added comprehensive user management functions
   - Updated RLS policies for profiles

2. **20250415_update_notifications.sql**
   - Added clerk_id support to notifications
   - Updated notification functions
   - Ensured backward compatibility with existing data

3. **20250415_update_storage_policies.sql**
   - Updated storage bucket policies
   - Added support for clerk_id in access control
   - Created is_admin() function for permission checks

## Authentication Flow

The new authentication flow works as follows:

1. **User Authentication**:
   - User signs in via Clerk
   - Clerk issues a JWT token with specific claims (user_id, user_email, role)

2. **Database Access**:
   - Frontend obtains JWT token from Clerk
   - Token is passed to Supabase in Authorization header
   - Supabase validates the token and extracts claims
   - RLS policies check the claims to grant or deny access

3. **Storage Access**:
   - Similar to database access, with JWT token used for authorization
   - Files can be organized in folders named after clerk_id for easy access control

## Implementation Details

### JWT Claims Structure

The Clerk JWT token contains these essential claims:

```json
{
  "user_id": "[clerk-user-id]",
  "user_email": "[user-email]",
  "role": "authenticated",
  "aud": "authenticated"
}
```

### Key Functions

We've implemented several key functions to support the new authentication flow:

- **get_my_profile()**: Gets the current user's profile using JWT claims
- **is_admin()**: Checks if the current user has admin privileges
- **get_auth_info()**: Provides detailed information about the current authentication context

### Backward Compatibility

The migration maintains backward compatibility in several ways:

- RLS policies check both `auth.uid()` and `auth.jwt() ->> 'user_id'`
- Functions accept both UUID-based user IDs and string-based clerk IDs
- Data migration preserves existing relationships

## Testing the Migration

To verify the migration's success:

1. Visit `/basic-auth-test` in your application
2. Test anonymous access to verify public endpoints work
3. Sign in with Clerk and test authenticated access
4. Verify the JWT claims are correctly received and processed
5. Test storage operations (upload, download, update, delete)

## Future Considerations

As we move forward with the Clerk integration:

1. **Gradual Transition**: Existing code using `auth.uid()` should continue to work, but new code should use clerk_id
2. **Frontend Updates**: Components should be updated to use the createSupabaseClient function with JWT tokens
3. **Edge Functions**: Update edge functions to work with clerk_id as the new user identifier

## Conclusion

This migration represents a significant architectural improvement, providing:

- More flexible authentication options through Clerk
- Better security with JWT-based authentication
- Improved user management capabilities
- Backward compatibility with existing data and code

The system now has a cleaner separation of concerns, with Clerk handling authentication and Supabase focusing on data storage and management.