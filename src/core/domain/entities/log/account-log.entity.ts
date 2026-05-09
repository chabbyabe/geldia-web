import { ICategorySimple } from "../transaction/transaction.entity"
import { ILogAccount, ILogUser } from "./transaction-log.entity"

export interface IAccountLogSnapshot {
  id: number
  icon: string | null
  name: string
  color: string | null
  notes: string | null
  balance: string
  userId: number
  isShared: boolean
  isDefault: boolean
  isSavings: boolean
  categoryIds: number[]
  countInAssets: boolean
  sharedUserIds: number[]
}

export interface IAccountLogReference extends ILogAccount {
  categories: ICategorySimple[]
}

export interface IAccountLog {
  id: number
  account: IAccountLogReference | null
  action: "created" | "updated" | "deleted"
  performedBy: ILogUser | null
  oldData: IAccountLogSnapshot | null
  newData: IAccountLogSnapshot | null
  note: string | null
  createdAt: string
}

export default class AccountLogEntity {
  id: number
  account: IAccountLogReference | null
  action: "created" | "updated" | "deleted"
  performedBy: ILogUser | null
  oldData: IAccountLogSnapshot | null
  newData: IAccountLogSnapshot | null
  note: string | null
  createdAt: string

  constructor(model: IAccountLog) {
    this.id = model.id
    this.account = model.account
    this.action = model.action
    this.performedBy = model.performedBy
    this.oldData = model.oldData
    this.newData = model.newData
    this.note = model.note
    this.createdAt = model.createdAt
  }

  getCurrentValuesAsJSON(): IAccountLog {
    return { ...this }
  }
}
