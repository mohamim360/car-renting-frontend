/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

interface Car {
  _id: string
  name: string
  brand: string
  model: string
  image: string
  rating?: number
  fuelType: 'Octane' | 'Hybrid' | 'Electric' | 'Diesel' | 'Petrol'
  passengerCapacity: number
  color: string
  condition: 'New' | 'Used'
}

interface CarState {
  cars: Car[]
  currentCar: Car | null
  loading: boolean
  error: string | null
}

const initialState: CarState = {
  cars: [],
  currentCar: null,
  loading: false,
  error: null,
}

// Get all cars
export const getAllCars = createAsyncThunk(
  'car/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cars')
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cars')
    }
  }
)

// Get car by ID
export const getCarById = createAsyncThunk(
  'car/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cars/${id}`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch car')
    }
  }
)

// Create car
export const createCar = createAsyncThunk(
  'car/create',
  async (carData: Partial<Car>, { rejectWithValue }) => {
    try {
      const response = await api.post('/cars', carData)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create car')
    }
  }
)

// Update car
export const updateCar = createAsyncThunk(
  'car/update',
  async ({ id, data }: { id: string; data: Partial<Car> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cars/${id}`, data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update car')
    }
  }
)

// Delete car
export const deleteCar = createAsyncThunk(
  'car/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/cars/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete car')
    }
  }
)

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentCar: (state, action: { payload: Car | null }) => {
      state.currentCar = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all cars
      .addCase(getAllCars.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.loading = false
        state.cars = action.payload
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get car by ID
      .addCase(getCarById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCarById.fulfilled, (state, action) => {
        state.loading = false
        state.currentCar = action.payload
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create car
      .addCase(createCar.fulfilled, (state, action) => {
        state.cars.push(action.payload)
      })
      // Update car
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex((c) => c._id === action.payload._id)
        if (index !== -1) {
          state.cars[index] = action.payload
        }
        if (state.currentCar?._id === action.payload._id) {
          state.currentCar = action.payload
        }
      })
      // Delete car
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((c) => c._id !== action.payload)
        if (state.currentCar?._id === action.payload) {
          state.currentCar = null
        }
      })
  },
})

export const { clearError, setCurrentCar } = carSlice.actions
export default carSlice.reducer

