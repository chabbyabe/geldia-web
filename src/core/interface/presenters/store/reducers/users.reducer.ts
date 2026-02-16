import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "@base/core/domain/entities/user/user.entity";


interface IUserState {
  users: IUser[] | []
}

const initialState: IUserState = {
  users: []
}

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    retrieveAllUsers(state, action: PayloadAction<IUser[]>) {
      let users: IUser[] = []
      action.payload.forEach((result: IUser) => {
        users.push(result)
      })
      state.users = users
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  retrieveAllUsers,
} = userSlice.actions
export default userSlice.reducer