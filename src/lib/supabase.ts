import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// CLINIC_ID removed - now using hospital-level authentication
// Public pages use environment variable directly
// Admin pages use currentClinic from AuthContext
export const CLINIC_CODE = import.meta.env.VITE_CLINIC_CODE