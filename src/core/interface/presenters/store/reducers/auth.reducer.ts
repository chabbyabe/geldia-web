import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "@domain/entities/auth/auth.entity";

const initialState: IAuthState = {
  user: null,
  initialized: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAuthState>) {
      state.user = action.payload.user
      state.initialized = true
    },
    clearUser(state) {
      state.user = null
      state.initialized = true
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setUser,
  clearUser,
  setInitialized,
} = authSlice.actions
export default authSlice.reducer
