# Supabase Integration Rules for PropertyPro

## Core Configuration
- Supabase services: Database, Authentication, Edge Functions, Storage, Realtime
- Supabase client-side SDK is initialized in `src/integrations/supabase/client.ts`
- Use the Supabase client-side SDK for all frontend-to-backend interactions
- Project configuration is managed through `src/config/supabase.ts`

## Code Organization
- STRICTLY separate concerns into modular code
- Supabase service interactions MUST be in the `services/` folder
- Database types MUST be in `src/integrations/supabase/types.ts`
- Edge functions MUST be in `supabase/functions/`
- RLS policies MUST be managed through SQL migrations

## Authentication Rules
- Use Clerk with Supabase Auth for user authentication
- No other auth libraries allowed
- Default implementation using `{ auth: { signIn, signUp, signOut, resetPassword } }`
- Pre-configured auth provider is configured in Supabase dashboard
- REQUIRED: Explain URL configurations for auth redirects in Supabase dashboard

## Database Rules
- Schema modifications MUST be done through SQL migrations
- NEVER modify auth.* or storage.* schemas directly
- ALWAYS implement Row Level Security (RLS) policies
- Database types MUST be kept in sync using "supabase gen types typescript"

## Storage Rules
- Storage bucket creation/modification MUST be done through SQL
- Storage RLS policies MUST be defined for each bucket
- File upload/download MUST use the storage client from `src/integrations/supabase/client.ts`

## Development Environment
- We are developing with production Supabase instance
- FORBIDDEN to use Supabase local development
- All changes MUST be made through SQL migrations or Edge Functions
- Configuration changes through `supabase/config.toml` only

## Security Rules
- MUST update security through SQL migrations for:
  - RLS policies in `migrations/*.sql`
  - Storage policies in `migrations/*.sql`
  - Function privileges in `migrations/*.sql`
- Deploy changes using proper SQL migrations

## State Management
- Use Supabase Realtime for live updates
- Subscribe to changes using `supabase.channel()`
- Verify presence with dedicated presence channels

## Project Structure
The Supabase integration for PropertyPro is structured as follows:

1. Main Configuration:
   - Path: `src/config/supabase.ts`
   - Contains: API URLs, keys, authentication settings, and environment validation

2. Core Supabase Client:
   - Path: `src/lib/supabase.ts`
   - Contains: Main Supabase client instance, error handling utilities, and helper functions

3. Clerk Authentication Integration:
   - Path: `src/lib/supabaseWithClerk.ts`
   - Contains: Functions to create Supabase clients with Clerk JWT tokens

4. Type Definitions:
   - Path: `src/integrations/supabase/types.ts`
   - Contains: TypeScript definitions for Supabase database schema

## Authentication Flow
1. User authenticates with Clerk
2. Clerk JWT token is obtained with proper claims (user_id, user_email)
3. Token is passed to Supabase for authenticated requests
4. Row Level Security (RLS) policies in Supabase use these claims

## Database Schema
The database schema includes the following tables:
1. agent_profiles: User profiles for agents
2. properties: Property listings
3. transactions: Property transactions
4. commissions: Agent commissions
5. teams: Team organization

## Data Access Patterns
When implementing data access:
1. Use the appropriate client:
   - For public data: `supabasePublic`
   - For authenticated data: `createSupabaseClient(token)`
2. Handle errors using `handleSupabaseError`
3. Implement proper loading and error states
4. Use TypeScript types that match the database schema

## Edge Functions
Edge functions should be used for:
1. Complex calculations that require server-side processing
2. Multi-step operations that need transaction safety
3. Operations that require additional security beyond RLS
4. MUST be placed in `supabase/functions/` directory

## Implementation Guidelines
1. Always use typed queries with proper error handling
2. Implement Row Level Security (RLS) for all tables
3. Use service functions for consistent data access patterns
4. Add proper loading, error, and success states in UI components

## Environment Variables
Required environment variables:
- VITE_SUPABASE_URL: Supabase project URL
- VITE_SUPABASE_ANON_KEY: Supabase anonymous key

## Migration and Deployment
1. All schema changes MUST be done through SQL migrations
2. RLS policies MUST be defined in migration files
3. Storage bucket policies MUST be defined in migration files
4. Function privileges MUST be defined in migration files
5. Deploy changes using proper SQL migration procedures

## Realtime Updates
1. Use Supabase Realtime for live data updates
2. Subscribe to changes using the channel API
3. Implement presence awareness when needed
4. Handle connection state and reconnection logic

When working with this codebase, please follow these guidelines for Supabase integration to maintain consistency and security.