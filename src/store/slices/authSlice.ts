/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'driver' | 'user'
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  initialized: boolean 
}

// Helper to get user from localStorage
const getInitialUser = (): User | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  return null
}
  

const initialState: AuthState = {
  user: getInitialUser(),
  token: localStorage.getItem('accessToken'),
  loading: false,
  error: null,
  initialized: false, 
}

// Add this thunk to initialize auth state
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        const user = JSON.parse(userStr)
        
        return { token, user }
      }
      return { token: null, user: null }
    } catch (error : any) {
      // If token is invalid, clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      return rejectWithValue('Session expired')
    }
  }
)

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { accessToken, ...userData } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(userData))
      return { token: accessToken, user: userData }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data)
      const { accessToken, ...userData } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(userData))
      return { token: accessToken, user: userData }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.initialized = true
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    },
    setUser: (state, action: { payload: any }) => {
      state.user = action.payload
      state.initialized = true
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.initialized = true
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false
        state.token = null
        state.user = null
        state.initialized = true
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.initialized = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.initialized = true
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.initialized = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.initialized = true
      })
  },
})

export const { logout, setUser, clearError } = authSlice.actions
export default authSlice.reducer
