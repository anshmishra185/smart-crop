import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const isPlaceholder = (value: string) =>
  /your[-_\s]|placeholder|example/i.test(value)

const isValidSupabaseUrl = (value: string | undefined) => {
  if (!value || isPlaceholder(value)) return false

  try {
    const url = new URL(value)
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.host)
  } catch {
    return false
  }
}

const isValidSupabaseKey = (value: string | undefined) =>
  Boolean(value && !isPlaceholder(value))

export const isSupabaseConfigured =
  isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseAnonKey)

export const supabase =
  isSupabaseConfigured && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
