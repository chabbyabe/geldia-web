import { IBaseAPIModel } from "@data/gateways/api/api.types"
import { IBaseDataModelEntity } from "@domain/entities/base/base.entity"
import { IUser } from "@domain/entities/user/user.entity"

export interface ICompany extends IBaseAPIModel, IBaseDataModelEntity {
  name: string
  isCurrent: boolean
  joinedAt: string | null
  resignedAt: string | null
  createdBy: IUser | null
  updatedBy: IUser | null
  deletedBy: IUser | null
}

export default class CompanyEntity {
  id: number
  name: string
  isCurrent: boolean
  joinedAt: string | null
  resignedAt: string | null
  createdBy: IUser | null
  updatedBy: IUser | null
  deletedBy: IUser | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null

  constructor(model: ICompany) {
    this.id = model.id
    this.name = model.name
    this.isCurrent = model.isCurrent ?? false
    this.joinedAt = model.joinedAt ?? null
    this.resignedAt = model.resignedAt ?? null
    this.createdBy = model.createdBy ?? null
    this.updatedBy = model.updatedBy ?? null
    this.deletedBy = model.deletedBy ?? null
    this.createdAt = model.createdAt ?? ""
    this.updatedAt = model.updatedAt ?? null
    this.deletedAt = model.deletedAt ?? null
  }

  getCurrentValuesAsJSON(): ICompany {
    return Object.assign({}, this)
  }
}
