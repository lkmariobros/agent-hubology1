// Import required modules
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { format, addDays } from 'https://esm.sh/date-fns@2.30.0';

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json"
};

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
