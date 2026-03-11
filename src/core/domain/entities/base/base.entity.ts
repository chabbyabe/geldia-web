export interface IBaseDataModelEntity {
  createdAt?: string
  updatedAt: string | null
  deletedAt: string | null
}

export interface IBaseIdNameEntity {
  id: number
  name: string
}