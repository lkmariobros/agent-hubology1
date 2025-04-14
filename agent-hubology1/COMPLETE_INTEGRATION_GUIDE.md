# Complete Integration Guide for Supabase lkmariobros Project

This guide provides step-by-step instructions for integrating the commission installment generation system into your Supabase lkmariobros project.

## Overview

The integration consists of three main components:

1. **Database Setup**: Creating the necessary tables and policies in your Supabase database
2. **Edge Function Deployment**: Deploying the `generate_commission_installments` edge function
3. **Frontend Integration**: Using the HTML interface to interact with the edge function

## Step 1: Database Setup

First, you need to set up the required database tables in your Supabase lkmariobros project.

1. Log in to your Supabase dashboard at [https://app.supabase.io](https://app.supabase.io)
2. Select your `lkmariobros` project
3. Go to the SQL Editor
4. Copy and paste the contents of `setup-commission-tables.sql` into the SQL Editor
5. Run the SQL script to create the necessary tables and policies

The script will create the following tables:
- `property_transactions`: Stores transaction details
- `commission_payment_schedules`: Defines payment schedules
- `schedule_installments`: Defines installment templates for each schedule
- `commission_installments`: Stores the generated installments

It will also set up appropriate Row Level Security (RLS) policies and insert a default payment schedule.

## Step 2: Edge Function Deployment

Next, deploy the edge function to your Supabase project.

### Prerequisites

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   supabase login
   ```

### Deployment Steps

1. Create the necessary directories for your edge function:
   ```bash
   mkdir -p supabase/functions/generate_commission_installments
   mkdir -p supabase/functions/_shared
   ```

2. Create the CORS helper file at `supabase/functions/_shared/cors.ts`:
   ```typescript
   export const corsHeaders = {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
     "Content-Type": "application/json"
   };
   ```

3. Create the edge function at `supabase/functions/generate_commission_installments/index.ts` using the provided code from `agent-hubology1/supabase/functions/generate_commission_installments/index.ts`

4. Deploy the edge function:
   ```bash
   # Link to your Supabase project
   supabase link --project-ref lkmariobros

   # Deploy the edge function
   supabase functions deploy generate_commission_installments --project-ref lkmariobros
   ```

5. Verify the deployment in the Supabase dashboard under "Edge Functions"

## Step 3: Frontend Integration

Finally, integrate the frontend component to interact with your edge function.

1. Host the `commission-generator.html` file in your web application or upload it to your Supabase storage bucket

2. If you're uploading to Supabase storage:
   - Go to the Storage section in your Supabase dashboard
   - Create a new bucket called "public" if it doesn't exist
   - Upload the `commission-generator.html` file
   - Set the bucket policy to allow public access
   - Get the public URL for the file

3. Update the Supabase URL in the HTML file if needed:
   ```javascript
   const SUPABASE_URL = "https://lkmariobros.supabase.co"; // Make sure this matches your project URL
   ```

## Step 4: Testing the Integration

To test the complete integration:

1. Create a test transaction in the `property_transactions` table:
   ```sql
   INSERT INTO property_transactions (
     agent_id, 
     property_id, 
     transaction_date, 
     transaction_type, 
     transaction_status, 
     commission_amount
   ) VALUES (
     'YOUR_AGENT_ID', -- Replace with a valid agent ID
     'YOUR_PROPERTY_ID', -- Replace with a valid property ID
     CURRENT_DATE,
     'Sale',
     'Completed',
     10000.00
   ) RETURNING id;
   ```

2. Note the returned transaction ID

3. Open the `commission-generator.html` file in your browser

4. Sign in to your application

5. Get a JWT token by running this in your browser console:
   ```javascript
   await Clerk.session.getToken({template: "supabase"})
   ```

6. Paste the JWT token in the form

7. Enter the transaction ID from step 2

8. Click "Generate Installments" to test the edge function

## Troubleshooting

If you encounter issues:

### Database Issues

- Check that all tables were created correctly
- Verify that the RLS policies are set up properly
- Ensure the default payment schedule was inserted

### Edge Function Issues

- Check the Supabase dashboard for function logs
- Verify that the function was deployed successfully
- Make sure the CORS headers are set up correctly

### Authentication Issues

- Ensure your Clerk JWT token is valid and not expired
- Verify that the JWT token has the correct claims for Supabase
- Check that your Supabase project is configured to accept Clerk JWTs

## Next Steps

After successful integration, you may want to:

1. Enhance the frontend with more features
2. Add additional payment schedule templates
3. Implement approval workflows for commission payments
4. Create reports and dashboards for commission tracking

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase Edge Functions Guide](https://supabase.io/docs/guides/functions)
- [Clerk Documentation](https://clerk.dev/docs)
- [Clerk-Supabase Integration Guide](https://clerk.dev/docs/integrations/supabase)
