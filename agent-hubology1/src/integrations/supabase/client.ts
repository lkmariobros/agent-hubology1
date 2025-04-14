
// This file exists for backward compatibility
// It re-exports the Supabase client from the main location

import { supabase, handleSupabaseError, supabaseUtils } from '@/lib/supabase';
import { SUPABASE_API_URL, SUPABASE_ANON_KEY, ENV_STATUS } from '@/config/supabase';

export { supabase, handleSupabaseError, supabaseUtils, SUPABASE_API_URL, SUPABASE_ANON_KEY, ENV_STATUS };
export default supabase;
