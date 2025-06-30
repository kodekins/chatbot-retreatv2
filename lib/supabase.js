import { createClient } from '@supabase/supabase-js'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtzfetpitbvprxavlrih.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0emZldHBpdGJ2cHJ4YXZscmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDM4MTEsImV4cCI6MjA2NjgxOTgxMX0.85zPkyls8T5hUBcTSCIzgJPmRfJVs4qyZvrqscO3DLw'

// Debug logging
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here'
) 