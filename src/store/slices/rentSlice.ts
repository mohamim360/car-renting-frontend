import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

interface Rent {
  _id: string
  user: string | any
  car: string | any
  rentStatus: 'pending' | 'ongoing' | 'completed'
  startingPoint: string
  destination: string
}

interface RentState {
  rents: Rent[]
  currentRent: Rent | null
  loading: boolean
  error: string | null
}

const initialState: RentState = {
  rents: [],
  currentRent: null,
  loading: false,
  error: null,
}

// Get all rents
export const getAllRents = createAsyncThunk(
  'rent/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rents')
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rents')
    }
  }
)

// Get rent by ID
export const getRentById = createAsyncThunk(
  'rent/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/rents/${id}`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rent')
    }
  }
)

// Create rent
export const createRent = createAsyncThunk(
  'rent/create',
  async (rentData: Partial<Rent>, { rejectWithValue }) => {
    try {
      const response = await api.post('/rents', rentData)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rent')
    }
  }
)

// Update rent
export const updateRent = createAsyncThunk(
  'rent/update',
  async ({ id, data }: { id: string; data: Partial<Rent> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/rents/${id}`, data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rent')
    }
  }
)

// Delete rent
export const deleteRent = createAsyncThunk(
  'rent/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/rents/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rent')
    }
  }
)

const rentSlice = createSlice({
  name: 'rent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentRent: (state, action: { payload: Rent | null }) => {
      state.currentRent = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all rents
      .addCase(getAllRents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllRents.fulfilled, (state, action) => {
        state.loading = false
        state.rents = action.payload
      })
      .addCase(getAllRents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get rent by ID
      .addCase(getRentById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getRentById.fulfilled, (state, action) => {
        state.loading = false
        state.currentRent = action.payload
      })
      .addCase(getRentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create rent
      .addCase(createRent.fulfilled, (state, action) => {
        state.rents.push(action.payload)
      })
      // Update rent
      .addCase(updateRent.fulfilled, (state, action) => {
        const index = state.rents.findIndex((r) => r._id === action.payload._id)
        if (index !== -1) {
          state.rents[index] = action.payload
        }
        if (state.currentRent?._id === action.payload._id) {
          state.currentRent = action.payload
        }
      })
      // Delete rent
      .addCase(deleteRent.fulfilled, (state, action) => {
        state.rents = state.rents.filter((r) => r._id !== action.payload)
        if (state.currentRent?._id === action.payload) {
          state.currentRent = null
        }
      })
  },
})

export const { clearError, setCurrentRent } = rentSlice.actions
export default rentSlice.reducer

