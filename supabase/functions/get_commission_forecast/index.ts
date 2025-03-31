
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
    const { agentId, months, limit } = await req.json();

    // Default to 6 months if not specified
    const forecastMonths = months || 6;
    const resultLimit = limit || 100;

    console.log(`Calculating forecast for agent ${agentId} for ${forecastMonths} months`);

    // Step 1: Get active payment schedules for the agent
    const { data: schedules, error: schedulesError } = await supabase
      .from('commission_payment_schedules')
      .select(`
        id,
        total_amount,
        remaining_amount,
        commission_installments (
          id,
          amount, 
          due_date,
          status
        )
      `)
      .eq('agent_id', agentId)
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
      .limit(resultLimit);

    if (schedulesError) {
      throw schedulesError;
    }

    console.log(`Found ${schedules?.length || 0} active payment schedules`);

    // Step 2: Generate forecast periods (current month + next X months)
    const today = new Date();
    const periods = [];

    for (let i = 0; i < forecastMonths; i++) {
      const forecastDate = new Date(today);
      forecastDate.setMonth(today.getMonth() + i);
      
      const monthKey = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
      
      periods.push({
        month: monthKey,
        expectedAmount: 0,
        confirmedAmount: 0,
        pendingAmount: 0
      });
    }

    // Step 3: Calculate expected amounts for each period based on installments
    let totalExpected = 0;

    if (schedules && schedules.length > 0) {
      schedules.forEach(schedule => {
        if (schedule.commission_installments && schedule.commission_installments.length > 0) {
          schedule.commission_installments.forEach(installment => {
            const dueDate = new Date(installment.due_date);
            const monthKey = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
            
            const periodIndex = periods.findIndex(p => p.month === monthKey);
            if (periodIndex >= 0) {
              totalExpected += installment.amount;
              
              if (installment.status === 'Paid') {
                periods[periodIndex].confirmedAmount += installment.amount;
              } else {
                periods[periodIndex].pendingAmount += installment.amount;
              }
              
              periods[periodIndex].expectedAmount += installment.amount;
            }
          });
        }
      });
    }

    // Step 4: Format and return the forecast data
    const forecast = {
      totalExpected,
      periods
    };

    console.log(`Forecast calculation complete. Total expected: ${totalExpected}`);

    return new Response(
      JSON.stringify(forecast),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating forecast:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
