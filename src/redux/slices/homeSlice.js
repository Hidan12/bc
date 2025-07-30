import { createSlice } from '@reduxjs/toolkit'

const usuarioSlice = createSlice({
  name: 'bancos',
  initialState: {
    banco: '',
  },
  reducers: {
    setBanco: (state, action) => {
      state.banco = action.payload
    }
  }
})

export const { setBanco } = usuarioSlice.actions
export default usuarioSlice.reducer