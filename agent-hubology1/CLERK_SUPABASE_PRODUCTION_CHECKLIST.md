# Clerk-Supabase Migration: Production Checklist

This checklist helps track the implementation status of the Clerk-Supabase migration in production.

## Pre-Migration Tasks

- [x] Create Clerk account and set up project
- [x] Configure Clerk JWT template for Supabase
- [x] Create migration SQL scripts
- [x] Create test components for validation

## Database Migration 

- [x] **Profile Standardization**
  - [x] Add `clerk_id` column to `profiles` table
  - [x] Update profile policies for Clerk JWT
  - [x] Test profile access with Clerk JWT

- [x] **Notifications System Migration**
  - [x] Add `clerk_id` column to `notifications` table
  - [x] Create safe notification helper functions
  - [x] Update notification policies for Clerk JWT
  - [x] Test notification retrieval with `/notifications-test`
  - [x] Test notification creation with `/notifications-test`
  - [x] Test notification realtime updates with `/notifications-test`

- [x] **Storage System Migration**
  - [x] Update storage bucket policies for Clerk JWT
  - [x] Create storage helper functions if needed
  - [x] Test storage uploads with `/storage-test`
  - [x] Test storage access with `/storage-test`
  - [x] Test storage deletion with `/storage-test`

## Production Security Hardening

- [ ] Update `property-images` bucket policies with proper user ownership
  ```sql
  -- Production-ready update policy
  CREATE POLICY "Users can only update their own images"
  ON storage.objects
  FOR UPDATE
  USING (
      bucket_id = 'property-images' AND (
          (storage.foldername(name))[1] = auth.jwt() ->> 'user_id' OR
          public.storage_is_admin()
      )
  );
  ```

- [ ] Update `property-documents` bucket policies with proper user ownership
  ```sql
  -- Similar policies for property-documents
  ```

- [ ] Fix notification admin access with non-recursive policies
  ```sql
  -- Use the check_admin_by_clerk_id function for admin access
  ```

- [ ] Add proper error handling to component functions
  ```typescript
  // Add try/catch blocks with appropriate error messages
  ```

## Frontend Component Updates

- [x] Create test pages for validating migration
  - [x] `/notifications-test`
  - [x] `/storage-test`

- [ ] Update production components
  - [ ] Update notification components to use new functions
  - [ ] Update file upload components to use Clerk JWT
  - [ ] Update profile management to work with Clerk

## Documentation

- [x] Document migration process in `docs/CLERK_SUPABASE_MIGRATION.md`
- [x] Create production checklist `CLERK_SUPABASE_PRODUCTION_CHECKLIST.md`
- [ ] Update README with information about the auth system
- [ ] Document JWT template configuration in Clerk

## Testing

- [ ] Test with multiple user accounts
- [ ] Test with admin account
- [ ] Test with regular user account
- [ ] Verify realtime functionality works
- [ ] Verify storage access works correctly

## Production Deployment

- [ ] Schedule maintenance window
- [ ] Back up database before migration
- [ ] Apply migrations in order:
  1. `standardize_profiles.sql`
  2. `update_notifications.sql`
  3. `update_storage_policies.sql`
- [ ] Deploy updated frontend code
- [ ] Verify all functionality after deployment
- [ ] Monitor for any issues

## Post-Deployment

- [ ] Implement analytics to monitor auth performance
- [ ] Set up monitoring for failed auth attempts
- [ ] Create a rollback plan in case of issues
- [ ] Document any new issues discovered

## Notes for Non-Technical Management

- The migration maintains dual auth systems during transition
- Users won't need to change passwords or re-authenticate
- Admin functions are protected by special security measures
- All tests can be accessed at `/notifications-test` and `/storage-test` routes

## Contact Information

- For technical assistance: [Developer Contact]
- For Clerk support: [Clerk Support Contact]
- For Supabase issues: [Supabase Support Contact]

---

This checklist should be reviewed regularly during implementation to ensure all aspects of the migration are properly addressed.