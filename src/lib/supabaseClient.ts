import { createClient } from '@supabase/supabase-js'

// @ts-expect-error - Vite env, TS-Modul-Konfiguration ignorieren
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// @ts-expect-error
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL oder Anon Key fehlt in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)