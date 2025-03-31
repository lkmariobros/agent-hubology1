
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request parameters
    const { installmentId, status, notes } = await req.json();

    if (!installmentId) {
      throw new Error('Installment ID is required');
    }

    if (!status) {
      throw new Error('Status is required');
    }

    console.log(`Processing installment ${installmentId} with status ${status}`);

    // Get user information from auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }

    // Step 1: Update the installment status
    const updates: any = {
      status,
      notes
    };

    // Add payment date and processor if marked as paid
    if (status === 'Paid') {
      updates.payment_date = new Date().toISOString();
      updates.processed_by = user.id;
    }

    const { data: updatedInstallment, error: updateError } = await supabase
      .from('commission_installments')
      .update(updates)
      .eq('id', installmentId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    console.log('Installment updated:', updatedInstallment);

    // Step 2: If marking as paid, update the remaining amount in the schedule
    if (status === 'Paid') {
      const { data: installment, error: installmentError } = await supabase
        .from('commission_installments')
        .select('amount, schedule_id')
        .eq('id', installmentId)
        .single();

      if (installmentError) {
        throw installmentError;
      }

      // Get the schedule
      const { data: schedule, error: scheduleError } = await supabase
        .from('commission_payment_schedules')
        .select('remaining_amount')
        .eq('id', installment.schedule_id)
        .single();

      if (scheduleError) {
        throw scheduleError;
      }

      // Update remaining amount
      const newRemainingAmount = Math.max(0, schedule.remaining_amount - installment.amount);
      
      const { error: updateScheduleError } = await supabase
        .from('commission_payment_schedules')
        .update({
          remaining_amount: newRemainingAmount,
          status: newRemainingAmount === 0 ? 'Completed' : 'Active',
          updated_at: new Date().toISOString()
        })
        .eq('id', installment.schedule_id);

      if (updateScheduleError) {
        throw updateScheduleError;
      }

      console.log(`Schedule ${installment.schedule_id} updated. Remaining amount: ${newRemainingAmount}`);

      // Step 3: Create notification for the agent
      const { data: scheduleData, error: getScheduleError } = await supabase
        .from('commission_payment_schedules')
        .select('agent_id')
        .eq('id', installment.schedule_id)
        .single();

      if (!getScheduleError && scheduleData) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: scheduleData.agent_id,
            title: 'Commission Payment Processed',
            message: `Your commission installment of $${installment.amount.toLocaleString()} has been processed.`,
            type: 'payment_processed',
            related_id: installmentId
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Installment ${status === 'Paid' ? 'payment processed' : 'status updated'}`,
        data: updatedInstallment
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing installment:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
