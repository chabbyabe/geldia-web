import { IAuthState } from "@domain/entities/auth/auth.entity"
import { clearUser, setUser } from "@interface/presenters/store/reducers/auth.reducer"
import { store } from "@interface/presenters/store/store"

export default class AuthRepository {
  setUser(user: IAuthState) {
    store.dispatch(setUser(user))
  }
  clearUser() {
    store.dispatch(clearUser())
  }
}