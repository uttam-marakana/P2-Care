import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

const supabaseReady = Boolean(config.supabaseUrl && config.supabaseSecretKey);

export const supabaseAdmin = supabaseReady
  ? createClient(config.supabaseUrl, config.supabaseSecretKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

export const supabaseAuth = supabaseReady
  ? createClient(config.supabaseUrl, config.supabaseSecretKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

export { supabaseReady };
