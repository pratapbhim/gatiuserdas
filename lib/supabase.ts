// Lazy-load Supabase to avoid bundling vendor chunks at module-eval time.
// This prevents build/runtime errors when Supabase isn't available during dev/build.
let _client: any = null
let _initialized = false

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !String(process.env.NEXT_PUBLIC_SUPABASE_URL).includes('placeholder')
)

export async function initSupabase() {
  if (_initialized) return _client
  try {
    const mod = await import('@supabase/supabase-js')
    const { createClient } = mod
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    _client = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')
    _initialized = true
    return _client
  } catch (err) {
    console.warn('Supabase dynamic import failed:', err)
    // Provide a minimal stub to avoid runtime crashes in non-auth flows
    _client = {
      auth: { signIn: async () => ({ data: null, error: null }) },
      from: () => ({ select: async () => ({ data: null, error: null }) }),
    }
    _initialized = true
    return _client
  }
}

// Export a proxy so existing import sites (which expect a `supabase` object) continue to work.
export const supabase: any = new Proxy({}, {
  get(_, prop) {
    return (...args: any[]) => {
      if (_initialized && _client && typeof (_client as any)[prop] === 'function') {
        return (_client as any)[prop](...args)
      }
      // If not initialized yet, initialize in background and return a safe promise.
      return initSupabase().then((client) => {
        const fn = (client as any)[prop]
        if (typeof fn === 'function') return fn(...args)
        return (client as any)[prop]
      }).catch(() => ({ data: null, error: null }))
    }
  }
})

export default supabase

