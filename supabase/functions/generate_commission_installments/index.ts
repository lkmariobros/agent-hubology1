
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { format, addDays } from 'https://esm.sh/date-fns@2.30.0';

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
      .select(`
        *,
        agent:agent_id(*),
        payment_schedule:payment_schedule_id(
          *,
          installments:schedule_installments(*)
        )
      `)
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
    
    // If no payment schedule is specified, get the default one
    if (!transaction.payment_schedule) {
      const { data: defaultSchedule, error: scheduleError } = await supabase
        .from('commission_payment_schedules')
        .select(`
          *,
          installments:schedule_installments(*)
        `)
        .eq('is_default', true)
        .single();
      
      if (scheduleError || !defaultSchedule) {
        return new Response(
          JSON.stringify({ 
            error: 'No payment schedule found',
            details: scheduleError
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      transaction.payment_schedule = defaultSchedule;
    }
    
    // Calculate total agent commission
    const agentCommission = transaction.commission_amount * (transaction.agent_percentage || 70) / 100;
    
    // Generate installments based on the payment schedule
    const installments = transaction.payment_schedule.installments.map(installment => {
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
