import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import carReducer from './slices/carSlice'
import rentReducer from './slices/rentSlice'
import bidReducer from './slices/bidSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    car: carReducer,
    rent: rentReducer,
    bid: bidReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

