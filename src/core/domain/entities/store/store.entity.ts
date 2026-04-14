import { IBaseAPIModel } from "@data/gateways/api/api.types"
import { IBaseDataModelEntity } from "@domain/entities/base/base.entity"
import { IUser } from "@domain/entities/user/user.entity"

export interface IStore extends IBaseAPIModel, IBaseDataModelEntity {
  name: string
  classification: string | null
  createdBy: IUser | null
  updatedBy: IUser | null
  deletedBy: IUser | null
}

export default class StoreEntity {
  id: number
  name: string
  classification: string | null
  createdBy: IUser | null
  updatedBy: IUser | null
  deletedBy: IUser | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null

  constructor(model: IStore) {
    this.id = model.id
    this.name = model.name
    this.classification = model.classification ?? null
    this.createdBy = model.createdBy ?? null
    this.updatedBy = model.updatedBy ?? null
    this.deletedBy = model.deletedBy ?? null
    this.createdAt = model.createdAt ?? ""
    this.updatedAt = model.updatedAt ?? null
    this.deletedAt = model.deletedAt ?? null
  }

  getCurrentValuesAsJSON(): IStore {
    return Object.assign({}, this)
  }
}
