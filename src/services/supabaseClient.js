import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fwepxfkxsfgiinyxqwrs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZXB4Zmt4c2ZnaWlueXhxd3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1OTcwNDUsImV4cCI6MjEwNzE3MzA0NX0.1SC7sT0G0D79egLQOWFGk-Iwy1JtCGJqZULRIwIp_dM';

// Check if valid credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
