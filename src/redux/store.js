import { configureStore } from '@reduxjs/toolkit'
import usuarioReducer from "./slices/homeSlice"

export const store = configureStore({
  reducer: {
    usuario: usuarioReducer,
  }
})

