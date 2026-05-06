import { IUser } from "@domain/entities/user/user.entity"
import { ICategorySimple } from "@domain/entities/transaction/transaction.entity"

export interface IFormAccount {
  name: string
  icon: string | null
  color: string | null
  balance: number | null
  countInAssets: boolean
  isDefault: boolean
  isShared: boolean
  isSavings: boolean
  notes: string | null
  user: IUser | null
  sharedUsers: IUser[] | null
  sharedUserIds?: number[]
  categories: ICategorySimple[] | null
  categoryIds?: number[]
}
