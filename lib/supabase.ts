import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
// ─── Replace these with your actual values ───────────────────────────────────
// Find them in: Supabase Dashboard → Your Project → Settings → API
const SUPABASE_URL = "https://lbcuecqqyqfcmuzexequ.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiY3VlY3FxeXFmY211emV4ZXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDkwMTMsImV4cCI6MjA4OTY4NTAxM30.2DMM3tqr7iVFO9d0-4OfkF_oZPP5ICL7tBxwQAG93GA";
// ─────────────────────────────────────────────────────────────────────────────
 
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
 