
// This file exists for backward compatibility
// It re-exports the Supabase client from the main location

import { supabase, handleSupabaseError, supabaseUtils } from '@/lib/supabase';

export { supabase, handleSupabaseError, supabaseUtils };
export default supabase;
