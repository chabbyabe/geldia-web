import { IAccountSimple } from "../transaction/transaction.entity"

export interface ILogUser {
  id: number
  firstName: string
  lastName: string
  username: string
}

export interface ILogSimpleReference {
  id: number
  name: string
}

export interface ILogTag extends ILogSimpleReference {
  color: string | null
}

export interface ILogTransactionType {
  id: number
  name: string
  icon: string
  color: string
}

export interface ILogAccount {
  id: number
  name: string
  icon: string | null
  color: string | null
  balance: string
  isDefault: boolean
  userId?: number
}

export interface ILogCategory extends ILogSimpleReference {
  color: string | null
  icon: string | null
  transactionType: ILogTransactionType | null
  parentCategory: ILogSimpleReference | null
}

export interface ILogTransactionData {
  id: number
  user: ILogUser | null
  store: ILogSimpleReference | null
  category: ILogCategory | null
  place: ILogSimpleReference | null
  account: ILogAccount | null
  pairTransaction: ILogAccount | null
  transactionType: ILogTransactionType | null
  tags: ILogTag[]
  updatedAt: string
  createdAt: string
  deletedAt: string | null
  amount: string | null
  name: string
  notes: string
  netAmount: string | null
  grossAmount: string | null
  debitMonthYear: string | null
  externalTransactionId: string | null
  isRecurring: boolean
  isRefunded: boolean
  refundedAt: string | null
  transactionAt: string
  previousBalance: string | null
  pairPreviousBalance: string | null
  createdBy: number | null
  updatedBy: number | null
  deletedBy: number | null
  recurring: boolean | null
}

export interface ITransactionLog {
  id: number
  performedBy: ILogUser
  transaction: ILogTransactionData | null
  action: "created" | "updated" | "deleted"
  oldData: ILogTransactionData | null
  newData: ILogTransactionData | null
  notes: string | null
  createdAt: string
}

export default class TransactionLogEntity {
  id: number
  performedBy: ILogUser
  transaction: ILogTransactionData | null
  action: "created" | "updated" | "deleted"
  oldData: ILogTransactionData | null
  newData: ILogTransactionData | null
  notes: string | null
  createdAt: string

  constructor(model: ITransactionLog) {
    this.id = model.id
    this.performedBy = model.performedBy
    this.transaction = model.transaction
    this.action = model.action
    this.oldData = model.oldData
    this.newData = model.newData
    this.notes = model.notes
    this.createdAt = model.createdAt
  }

  getCurrentValuesAsJSON(): ITransactionLog {
    return { ...this }
  }
}
