import { IBaseAPIModel } from "@data/gateways/api/api.types"
import { IBaseDataModelEntity } from "@domain/entities/base/base.entity"
import { ITransactionType, ICategorySimple } from "@domain/entities/transaction/transaction.entity"
import { IUser } from "@domain/entities/user/user.entity"

export interface ICategoryListItem {
  id: number
  name: string
  color: string | null
  icon: string | null
  transactionType: ITransactionType | null
  parentCategory: ICategorySimple | null
  notes: string | null
}

export interface ICategory extends IBaseAPIModel, IBaseDataModelEntity {
  name: string
  notes: string | null
  color: string | null
  icon: string | null
  createdBy: IUser | null
  updatedBy: IUser | null
  deletedBy: IUser | null
  transactionType: ITransactionType | null
  parentCategory: ICategorySimple | null
  children: ICategoryListItem[]
}

export default class CategoryEntity {
  id: number
  createdBy: IUser | null
  updatedBy: IUser | null
  deletedBy: IUser | null
  transactionType: ITransactionType | null
  parentCategory: ICategorySimple | null
  children: ICategoryListItem[]
  name: string
  notes: string | null
  color: string | null
  icon: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null

  constructor(model: ICategory) {
    this.id = model.id
    this.createdBy = model.createdBy ?? null
    this.updatedBy = model.updatedBy ?? null
    this.deletedBy = model.deletedBy ?? null
    this.transactionType = model.transactionType ?? null
    this.parentCategory = model.parentCategory ?? null
    this.children = model.children ?? []
    this.name = model.name
    this.notes = model.notes ?? null
    this.color = model.color ?? null
    this.icon = model.icon ?? null
    this.createdAt = model.createdAt ?? ""
    this.updatedAt = model.updatedAt ?? null
    this.deletedAt = model.deletedAt ?? null
  }

  getCurrentValuesAsJSON(): ICategory {
    return Object.assign({}, this)
  }
}
