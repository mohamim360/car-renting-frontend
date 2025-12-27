import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

interface Bid {
  _id: string
  rentId: string | any
  driverId: string | any
  bidAmount: number
  bidStatus: 'accepted' | 'pending' | 'rejected'
  driverLocation: string
}

interface BidState {
  bids: Bid[]
  currentBid: Bid | null
  loading: boolean
  error: string | null
}

const initialState: BidState = {
  bids: [],
  currentBid: null,
  loading: false,
  error: null,
}

// Get all bids
export const getAllBids = createAsyncThunk(
  'bid/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bids')
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids')
    }
  }
)

// Get bid by ID
export const getBidById = createAsyncThunk(
  'bid/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bids/${id}`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bid')
    }
  }
)

// Create bid
export const createBid = createAsyncThunk(
  'bid/create',
  async (bidData: Partial<Bid>, { rejectWithValue }) => {
    try {
      const response = await api.post('/bids', bidData)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bid')
    }
  }
)

// Update bid
export const updateBid = createAsyncThunk(
  'bid/update',
  async ({ id, data }: { id: string; data: Partial<Bid> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bids/${id}`, data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bid')
    }
  }
)

// Delete bid
export const deleteBid = createAsyncThunk(
  'bid/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/bids/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete bid')
    }
  }
)

const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentBid: (state, action: { payload: Bid | null }) => {
      state.currentBid = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all bids
      .addCase(getAllBids.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllBids.fulfilled, (state, action) => {
        state.loading = false
        state.bids = action.payload
      })
      .addCase(getAllBids.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get bid by ID
      .addCase(getBidById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBidById.fulfilled, (state, action) => {
        state.loading = false
        state.currentBid = action.payload
      })
      .addCase(getBidById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create bid
      .addCase(createBid.fulfilled, (state, action) => {
        state.bids.push(action.payload)
      })
      // Update bid
      .addCase(updateBid.fulfilled, (state, action) => {
        const index = state.bids.findIndex((b) => b._id === action.payload._id)
        if (index !== -1) {
          state.bids[index] = action.payload
        }
        if (state.currentBid?._id === action.payload._id) {
          state.currentBid = action.payload
        }
      })
      // Delete bid
      .addCase(deleteBid.fulfilled, (state, action) => {
        state.bids = state.bids.filter((b) => b._id !== action.payload)
        if (state.currentBid?._id === action.payload) {
          state.currentBid = null
        }
      })
  },
})

export const { clearError, setCurrentBid } = bidSlice.actions
export default bidSlice.reducer

