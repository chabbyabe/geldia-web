import { IUser } from "@domain/entities/user/user.entity"

export interface IFormAccount {
  name: string
  icon?: string
  color?: string
  balance?: number | null
  countInAssets: boolean
  isDefault: boolean
  isShared: boolean
  notes?: string
  user?: IUser | null
  sharedUsers?: IUser[]
}
