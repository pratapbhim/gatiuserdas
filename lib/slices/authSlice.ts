import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { supabase, isSupabaseConfigured } from '../supabase'

interface User {
  id: string
  phone: string
  name?: string
  email?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
  },
})

export const { setLoading, setUser, setError, logout } = authSlice.actions

export const signInWithPhone = (phone: string) => async (dispatch: any) => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file. See SETUP.md for instructions.')
    }
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    })
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error: any) {
    dispatch(setError(error.message))
    return { success: false, error: error.message }
  } finally {
    dispatch(setLoading(false))
  }
}

export const verifyOtp = (phone: string, token: string) => async (dispatch: any) => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file. See SETUP.md for instructions.')
    }
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: 'sms',
    })
    
    if (error) throw error
    
    if (data.user) {
      dispatch(setUser({
        id: data.user.id,
        phone: phone,
        name: data.user.user_metadata?.name,
        email: data.user.email,
      }))
    }
    
    return { success: true, data }
  } catch (error: any) {
    dispatch(setError(error.message))
    return { success: false, error: error.message }
  } finally {
    dispatch(setLoading(false))
  }
}

export const signUpWithPhone = (phone: string, name?: string) => async (dispatch: any) => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file. See SETUP.md for instructions.')
    }
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
      options: {
        data: {
          name: name || '',
        },
      },
    })
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error: any) {
    dispatch(setError(error.message))
    return { success: false, error: error.message }
  } finally {
    dispatch(setLoading(false))
  }
}

export default authSlice.reducer

