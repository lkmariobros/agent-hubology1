# Deploying Edge Functions to Supabase lkmariobros Project

This guide will help you deploy the `generate_commission_installments` edge function to your Supabase lkmariobros project.

## Prerequisites

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   supabase login
   ```

## Step 1: Create the Edge Function Structure

First, create the necessary directories and files for your edge function:

```bash
# Create the function directories
mkdir -p supabase/functions/generate_commission_installments
mkdir -p supabase/functions/_shared
```

## Step 2: Copy the Edge Function Files

Create the following files with the provided content:

### 1. `supabase/functions/_shared/cors.ts`

```typescript
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json"
};
```

### 2. `supabase/functions/generate_commission_installments/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { format, addDays } from 'https://esm.sh/date-fns@2.30.0';

// This comment helps TypeScript recognize this as a module
export {};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { transactionId } = await req.json();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the transaction details
    const { data: transaction, error: txError } = await supabase
      .from('property_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();


    if (txError || !transaction) {
      return new Response(
        JSON.stringify({
          error: txError?.message || 'Transaction not found',
          details: txError
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the payment schedule
    let paymentScheduleId = transaction.payment_schedule_id;

    // If no payment schedule is specified, get the default one
    if (!paymentScheduleId) {
      const { data: defaultSchedule, error: scheduleError } = await supabase
        .from('commission_payment_schedules')
        .select('id')
        .eq('is_default', true)
        .single();

      if (scheduleError || !defaultSchedule) {
        return new Response(
          JSON.stringify({
            error: 'No default payment schedule found',
            details: scheduleError
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      paymentScheduleId = defaultSchedule.id;

      // Update the transaction with the default payment schedule
      await supabase
        .from('property_transactions')
        .update({ payment_schedule_id: paymentScheduleId })
        .eq('id', transactionId);
    }

    // Get the payment schedule with its installments
    const { data: paymentSchedule, error: scheduleError } = await supabase
      .from('commission_payment_schedules')
      .select(`
        *,
        installments:schedule_installments(*)
      `)
      .eq('id', paymentScheduleId)
      .single();

    if (scheduleError || !paymentSchedule) {
      return new Response(
        JSON.stringify({
          error: 'Failed to retrieve payment schedule',
          details: scheduleError
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total agent commission (default to 70% if not specified)
    // For co-broking transactions, this would be adjusted based on the split
    const agentPercentage = 70; // Default to 70% for the agent
    const agentCommission = transaction.commission_amount * agentPercentage / 100;

    // Define the installment interface
    interface ScheduleInstallment {
      installment_number: number;
      percentage: number;
      days_after_transaction: number;
      description?: string;
    }

    // Generate installments based on the payment schedule
    const installments = paymentSchedule.installments.map((installment: ScheduleInstallment) => {
      // Calculate the scheduled date
      const transactionDate = new Date(transaction.transaction_date);
      const scheduledDate = addDays(transactionDate, installment.days_after_transaction);

      // Calculate the amount for this installment
      const amount = (agentCommission * installment.percentage) / 100;

      return {
        transaction_id: transactionId,
        installment_number: installment.installment_number,
        agent_id: transaction.agent_id,
        amount,
        percentage: installment.percentage,
        scheduled_date: format(scheduledDate, 'yyyy-MM-dd'),
        status: 'Pending',
        notes: installment.description || `Installment ${installment.installment_number}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    // Insert the installments
    const { data: insertedInstallments, error: insertError } = await supabase
      .from('commission_installments')
      .insert(installments)
      .select();

    if (insertError) {
      return new Response(
        JSON.stringify({
          error: 'Failed to create commission installments',
          details: insertError
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the transaction to mark that installments have been generated
    await supabase
      .from('property_transactions')
      .update({ installments_generated: true })
      .eq('id', transactionId);

    return new Response(
      JSON.stringify({
        success: true,
        installments: insertedInstallments,
        count: insertedInstallments.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## Step 3: Deploy the Edge Function

Now, deploy the edge function to your Supabase lkmariobros project:

```bash
# Link to your Supabase project (replace 'lkmariobros' with your actual project reference)
supabase link --project-ref lkmariobros

# Deploy the edge function
supabase functions deploy generate_commission_installments --project-ref lkmariobros
```

## Step 4: Test the Edge Function

After deployment, you can test the edge function using the Supabase dashboard or with a curl command:

```bash
curl -X POST 'https://lkmariobros.supabase.co/functions/v1/generate_commission_installments' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"transactionId": "YOUR_TRANSACTION_ID"}'
```

## Required Database Tables

For this edge function to work, make sure your Supabase lkmariobros project has the following tables:

1. `property_transactions` - Stores transaction details
2. `commission_payment_schedules` - Defines payment schedules
3. `schedule_installments` - Defines installment templates for each schedule
4. `commission_installments` - Stores the generated installments

If these tables don't exist, you'll need to create them first.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Supabase CLI logs for errors
2. Verify that your Supabase project has the required tables
3. Ensure you have the correct permissions to deploy functions
