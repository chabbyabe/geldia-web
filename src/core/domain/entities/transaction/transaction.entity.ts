import { IUser } from "@domain/entities/user/user.entity";
import { IBaseDataModelEntity, IBaseIdNameEntity } from "@domain/entities/base/base.entity"
import { IBaseAPIModel } from "@data/gateways/api/api.types";
export interface IStoreSimple extends IBaseIdNameEntity {
  inputValue?: string | null
}

export interface IPlaceSimple extends IBaseIdNameEntity {
  inputValue?: string | null
}

export interface IAccountSimple extends ITransactionType {
  balance: number | null
  isDefault: boolean
}

export interface ICategorySimple extends ITransactionType {
  parentCategory: ICategorySimple | null
  transactionType: ITransactionType | null
  inputValue?: string | null
}

export interface ITagSimple extends IBaseIdNameEntity {
  color: string | null
}

export interface ITransaction extends IBaseAPIModel, IBaseDataModelEntity {
  name: string
  user: IUser | null
  store: IStoreSimple | null
  place: IPlaceSimple | null
  account: IAccountSimple | null
  transactionType: ITransactionType | null
  tags: ITagSimple[] | null
  amount: number
  notes: string | null
  netAmount: number | null
  grossAmount: number | null
  debitMonthYear: string | null
  externalTransactionId: number | null
  pairTransaction: IAccountSimple | null
  isRecurring: boolean
  isRefunded: boolean
  refundedAt: string | null
  transactionAt: string | null
  category: ICategorySimple | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

export interface ITransactionType {
  id: number
  name: string
  icon: string | null
  color: string | null
}

export default class TransactionEntity {
  id: number
  name: string
  user: IUser | null
  store: IStoreSimple | null
  place: IPlaceSimple | null
  account: IAccountSimple | null
  tags: ITagSimple[] | null
  transactionType: ITransactionType | null
  amount: number
  notes: string | null
  netAmount: number | null
  grossAmount: number | null
  debitMonthYear: string | null
  externalTransactionId: number | null
  pairTransaction: IAccountSimple | null
  isRecurring: boolean
  isRefunded: boolean
  refundedAt: string | null
  transactionAt: string | null
  category: ICategorySimple | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null

  constructor(model: ITransaction) {
    this.id = model.id
    this.name = model.name
    this.notes = model.notes
    this.user = model.user
    this.store = model.store
    this.place = model.place
    this.account = model.account
    this.tags = model.tags
    this.transactionType = model.transactionType
    this.amount = model.amount
    this.netAmount = model.netAmount
    this.grossAmount = model.grossAmount
    this.debitMonthYear = model.debitMonthYear
    this.externalTransactionId = model.externalTransactionId
    this.pairTransaction = model.pairTransaction
    this.isRecurring = model.isRecurring ?? false
    this.isRefunded = model.isRefunded ?? false
    this.refundedAt = model.refundedAt
    this.transactionAt = model.transactionAt
    this.category = model.category
    this.createdAt = model.createdAt ?? "2023-05-04"
    this.updatedAt = model.updatedAt
    this.deletedAt = model.deletedAt
  }

  getCurrentValuesAsJSON(): ITransaction {
    return Object.assign({}, this);
  }

  static mock(overrides: Partial<ITransaction> = {}): TransactionEntity {
    return new TransactionEntity({
      id: 1,
      name: 'Test Channel',
      notes: 'Sample note',
      amount: 1000.0,
      netAmount: 1000.0,
      grossAmount: 1000.0,
      debitMonthYear: "2023-05-04",
      user: {
        id: 1,
        username: 'JohnDoe23',
        firstName: 'John',
        lastName: 'Doe',
      },
      store: {
        id: 101,
        name: 'Sample Store',
      },
      place: {
        id: 101,
        name: 'Woerden',
      },
      account: {
        id: 201,
        name: 'Checking Account',
        balance: 1000.0,
        icon: null,
        color: null,
        isDefault: false
      },
      transactionType: {
        id: 301,
        name: 'Income',
        icon: null,
        color: null,
      },
      tags: null,
      transactionAt: null,
      isRecurring: false,
      isRefunded: false,
      refundedAt: null,
      externalTransactionId: null,
      pairTransaction: null,
      category: null,
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: null,
      deletedAt: null,
      ...overrides,
    });
  }
}

