# Database Setup Guide for Agent Hubology

This document explains how to properly set up and configure the database for Agent Hubology. After recent updates, we've standardized our approach to make development more consistent and secure.

## Prerequisites

- Access to Supabase dashboard
- Clerk developer account
- Basic understanding of SQL and PostgreSQL

## Setup Process

### 1. Apply the Standardization Migration

We've created a standardized database structure that consolidates our previously inconsistent profile tables and implements consistent security policies.

1. Go to the Supabase dashboard SQL Editor
2. Open the migration file from `supabase/migrations/20250415_standardize_profiles.sql`
3. Execute the SQL script to apply the standardization changes
4. Verify that you see the following success output:
   - New `profiles` table created
   - Functions created successfully
   - RLS policies applied

### 2. Configure Clerk JWT Template

For our authentication to work properly, we need to configure Clerk to generate JWTs with specific claims:

1. Go to your Clerk dashboard
2. Navigate to JWT Templates
3. Create or edit the template named "supabase"
4. Use the exact JSON configuration from our `CLERK_JWT_TEMPLATE_CONFIG.md` file
5. Save the template

### 3. Test Authentication Flow

After setup, test the authentication flow:

1. Open the application and navigate to `/basic-auth-test`
2. Sign in with Clerk
3. Test the JWT generation and Supabase connection
4. Verify that authentication info is correctly retrieved

## Database Structure Overview

Our database now has a clear and logical structure:

### Core Tables

- `profiles`: Stores user profile information and links to Clerk IDs
- `enhanced_properties`: Stores property listings
- `property_transactions`: Records transactions related to properties
- `opportunities`: Tracks potential property opportunities

### Key Relationships

- Users (via Clerk) connect to profiles via `clerk_id`
- Properties are linked to users/profiles
- Transactions reference properties and users
- Security is enforced through Row Level Security policies

## Authentication Flow

Our system uses a "Direct Token" approach with Clerk and Supabase:

1. User authenticates with Clerk
2. Application gets a JWT token from Clerk
3. Token is passed to Supabase in the Authorization header
4. Supabase RLS policies check the token claims
5. Access is granted based on the user's identity and role

## Row Level Security (RLS)

We've implemented consistent RLS policies:

- Users can only read/update their own profiles
- Admins can view and update all profiles
- Property access is restricted to owners and admins
- Authenticated users can view shared resources

## Common Tasks

### Creating a New User Profile

```sql
SELECT create_profile_for_clerk_user(
  'clerk_user_id',
  'user@example.com',
  'First',
  'Last',
  'agent'
);
```

### Checking User Role

```sql
SELECT user_has_role('admin');
```

### Getting Current User Profile

```sql
SELECT * FROM get_my_profile();
```

## Troubleshooting

### "No Profile Found" Error

This usually means the JWT claims from Clerk don't match what our RLS policies expect:

1. Check your JWT template configuration
2. Verify the user has a profile in the profiles table
3. Check the browser console for JWT-related errors

### "Permission Denied" Errors

These occur when RLS policies block access:

1. Check if the user's role is correct in the profiles table
2. Verify that the user owns the resource they're trying to access
3. Check if admin privileges are needed

## Migration Strategy

We've developed a comprehensive migration strategy (see `MIGRATION_STRATEGY.md`) that outlines:

1. How to create and apply migrations
2. Best practices for schema changes
3. How to handle special cases
4. Testing and rollback plans

When developing new features that require database changes, please follow this strategy to maintain database integrity.

## Next Steps

1. Ensure all developers understand the new database structure
2. Update any code that used the old profile tables
3. Run the application with the standardized database
4. Report any issues or inconsistencies

By following this setup guide, you'll have a properly configured database that works consistently with our authentication system.