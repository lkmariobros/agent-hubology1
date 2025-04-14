
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Test all edge functions to make sure they're working correctly
 */
export async function testEdgeFunctions() {
  try {
    // Test the generate_commission_installments function
    const response = await supabase.functions.invoke('generate_commission_installments', {
      body: { testMode: true }
    });
    
    if (response.error) {
      toast.error(`Edge function error: ${response.error.message}`);
      console.error('Edge function error:', response.error);
      return false;
    }
    
    toast.success('Edge functions are working correctly!');
    console.log('Edge function test result:', response.data);
    return true;
  } catch (error: any) {
    toast.error(`Edge function test failed: ${error.message}`);
    console.error('Edge function test error:', error);
    return false;
  }
}
