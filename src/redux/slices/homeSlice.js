import { createSlice } from '@reduxjs/toolkit'

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState: {
    nombre: '',
    email: '',
    autenticado: false
  },
  reducers: {
    iniciarSesion: (state, action) => {
      state.nombre = action.payload.nombre
      state.email = action.payload.email
      state.autenticado = true
    },
    cerrarSesion: (state) => {
      state.nombre = ''
      state.email = ''
      state.autenticado = false
    }
  }
})

export const { iniciarSesion, cerrarSesion } = usuarioSlice.actions
export default usuarioSlice.reducer