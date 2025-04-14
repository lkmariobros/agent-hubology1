
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { format, addDays, addMonths } from 'https://esm.sh/date-fns@2.30.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { agentId, months = 12 } = await req.json();
    
    console.log(`Generating forecast for agent: ${agentId}, months: ${months}`);
    
    // First, clean up existing forecast projections for this agent
    const { error: deleteError } = await supabase
      .from('forecast_projections')
      .delete()
      .eq('agent_id', agentId);
    
    if (deleteError) {
      console.error('Error cleaning up existing projections:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to clean up existing projections', details: deleteError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the default payment schedule
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
        JSON.stringify({ error: 'No default payment schedule found', details: scheduleError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get agent's average transaction value and frequency
    const { data: agentStats, error: statsError } = await supabase
      .from('property_transactions')
      .select('transaction_value, commission_amount, created_at')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (statsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve agent statistics', details: statsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If no historical data, use defaults
    if (!agentStats || agentStats.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No historical data found for forecast', projections: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate averages
    const avgTransactionValue = agentStats.reduce((sum, tx) => sum + (tx.transaction_value || 0), 0) / agentStats.length;
    const avgCommissionAmount = agentStats.reduce((sum, tx) => sum + (tx.commission_amount || 0), 0) / agentStats.length;
    
    // Calculate frequency (transactions per month)
    const oldestTx = new Date(agentStats[agentStats.length - 1].created_at);
    const newestTx = new Date(agentStats[0].created_at);
    const monthDiff = (newestTx.getFullYear() - oldestTx.getFullYear()) * 12 + (newestTx.getMonth() - oldestTx.getMonth()) + 1;
    const txPerMonth = agentStats.length / Math.max(1, monthDiff);
    
    console.log(`Agent averages: ${avgTransactionValue} transaction value, ${avgCommissionAmount} commission, ${txPerMonth} per month`);
    
    // Generate forecast projections
    const projections = [];
    const today = new Date();
    
    // For each month in the forecast period
    for (let i = 0; i < months; i++) {
      const monthDate = addMonths(today, i);
      const expectedTransactions = Math.round(txPerMonth);
      
      // For each expected transaction in this month
      for (let j = 0; j < expectedTransactions; j++) {
        // Generate a random day in the month
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const transactionDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), randomDay);
        const transactionDateStr = format(transactionDate, 'yyyy-MM-dd');
        const projectedTxId = `projected_${agentId}_${format(transactionDate, 'yyyyMMdd')}_${j}`;
        
        // Generate installments based on the default schedule
        defaultSchedule.installments.forEach(installment => {
          const scheduledDate = addDays(transactionDate, installment.days_after_transaction);
          const amount = (avgCommissionAmount * installment.percentage) / 100;
          
          projections.push({
            projected_transaction_id: projectedTxId,
            agent_id: agentId,
            installment_number: installment.installment_number,
            amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
            percentage: installment.percentage,
            scheduled_date: format(scheduledDate, 'yyyy-MM-dd'),
            transaction_date: transactionDateStr,
            status: 'Projected'
          });
        });
      }
    }
    
    // Insert the projections
    if (projections.length > 0) {
      const { data: insertedProjections, error: insertError } = await supabase
        .from('forecast_projections')
        .insert(projections)
        .select();
      
      if (insertError) {
        return new Response(
          JSON.stringify({ error: 'Failed to insert forecast projections', details: insertError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Generated ${projections.length} forecast projections for agent ${agentId}`,
          count: projections.length,
          projections: insertedProjections
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No projections generated',
          count: 0,
          projections: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
