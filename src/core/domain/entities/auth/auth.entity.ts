import type { IUser } from "@domain/entities/user/user.entity";

export interface IAuthState {
  user: IUser | null
  initialized: boolean
}
