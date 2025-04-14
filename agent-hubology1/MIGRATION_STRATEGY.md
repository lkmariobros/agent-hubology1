# Database Migration Strategy

This document outlines our migration strategy for maintaining and evolving the database schema for Agent Hubology.

## Migration Principles

1. **Incremental Changes**: Apply migrations in small, manageable increments
2. **Backwards Compatibility**: Ensure new changes don't break existing functionality
3. **Data Preservation**: Never lose existing data during schema changes
4. **Idempotence**: Migrations should be safe to run multiple times
5. **Test First**: Always test migrations in a staging environment before production

## Migration Folder Structure

All migrations should be stored in the `supabase/migrations/` directory with the following naming convention:

```
YYYYMMDD_descriptive_name.sql
```

Example: `20250415_standardize_profiles.sql`

## Migration Order

When applying migrations, follow this dependency order:

1. **Extensions and Base Types**
   - UUID extension
   - Custom enumerated types

2. **Core Tables (No Foreign Keys)**
   - `agencies`
   - `property_types`
   - `transaction_types`
   - `profiles`

3. **Dependent Tables**
   - `enhanced_properties` (depends on `profiles`)
   - `property_transactions` (depends on `enhanced_properties`, `profiles`)

4. **Relationship Tables**
   - `commissions`
   - `commission_approvals`
   - `commission_installments`

5. **Utility Tables**
   - `notifications`
   - `opportunities`

6. **Functions and Procedures**
   - Profile management functions
   - Commission calculation functions
   - Notification functions

7. **RLS Policies**
   - Table-specific policies
   - Cross-table policies

8. **Permissions**
   - Role-specific grants
   - Function execution permissions

## Migration Best Practices

### Writing Migrations

1. **Use IF EXISTS / IF NOT EXISTS**: Prevent errors on repeated runs
   ```sql
   CREATE TABLE IF NOT EXISTS public.my_table (...);
   DROP TABLE IF EXISTS public.old_table;
   ```

2. **Use OR REPLACE for Functions**: Allow updating functions without dropping
   ```sql
   CREATE OR REPLACE FUNCTION my_function() ...
   ```

3. **Back Up Data Before Schema Changes**:
   ```sql
   -- Create backup before changing schema
   CREATE TABLE temp_backup AS SELECT * FROM my_table;
   
   -- After schema changes, migrate data back
   INSERT INTO my_table (new_columns) 
   SELECT old_columns FROM temp_backup;
   ```

4. **Use Transactions**: Wrap migrations in transactions for atomicity
   ```sql
   BEGIN;
   -- Migration steps
   COMMIT;
   ```

5. **Document Each Migration**: Include a comment header explaining the purpose
   ```sql
   -- Migration: Add user_preferences column
   -- Description: Adds a JSONB column to store user preferences
   -- Date: 2025-04-15
   ```

### Applying Migrations

1. **Apply in Order**: Always apply migrations in chronological order
2. **Record Applied Migrations**: Track which migrations have been applied
3. **Verify Success**: Check that each migration completes successfully

## Handling Special Cases

### Schema Changes to Tables with Data

When modifying a table that already contains data:

1. Create a backup of the table data
2. Make schema changes
3. Transform data if needed
4. Reinsert data with new schema
5. Verify data integrity

Example:
```sql
-- Backup existing data
CREATE TABLE temp_profiles_backup AS
SELECT * FROM profiles;

-- Modify table schema
ALTER TABLE profiles ADD COLUMN preferences JSONB;

-- Reinsert with default preferences
UPDATE profiles SET preferences = '{}'::JSONB;
```

### Renaming or Removing Columns

When renaming columns:

1. Add the new column
2. Copy data from old to new column
3. Eventually remove the old column (in a later migration)

This allows for a transition period where both columns exist.

### Changing Column Types

When changing column types:

1. Add a new column with the correct type
2. Convert and copy data from old column
3. Drop the old column
4. Rename the new column to the original name

Example:
```sql
-- Add new column with correct type
ALTER TABLE users ADD COLUMN age_new INTEGER;

-- Convert and copy data
UPDATE users SET age_new = age::INTEGER;

-- Drop old column and rename new one
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users RENAME COLUMN age_new TO age;
```

## Testing Migrations

Before applying migrations to production:

1. Run the migration against a copy of production data
2. Verify all existing functionality works
3. Check data integrity
4. Measure performance impact

## Rollback Plan

Each migration should have a corresponding rollback script that undoes the changes:

```sql
-- Migration
CREATE TABLE new_feature (...);

-- Rollback
DROP TABLE IF EXISTS new_feature;
```

Store rollback scripts in `supabase/rollbacks/` with matching names.

## Current Migration Status

We have implemented our first major migration: `20250415_standardize_profiles.sql`

This migration:
1. Standardizes our profiles implementation
2. Fixes JWT integration issues
3. Updates RLS policies to use consistent JWT approach

Future migrations will follow this strategy document's guidelines.