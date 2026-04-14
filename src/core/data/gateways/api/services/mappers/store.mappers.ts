import { IStoreModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { IPagedStoreEntity } from "@domain/entities/store/paged.store.entity"
import { IStore } from "@domain/entities/store/store.entity"
import { objectToCamel } from "ts-case-convert"

export const mapStoreAttributes = (initialModel: IStoreModel): IStore => {
  return objectToCamel(initialModel) as IStore
}

export const mapPagedStoreAttributes = (
  initialModel: IPagedAPIViewModel<IStoreModel>
): IPagedStoreEntity => {
  const list = initialModel.results.map((result: IStoreModel) => ({
    ...mapStoreAttributes(result)
  }))

  return {
    ...objectToCamel(initialModel),
    results: list
  } as IPagedStoreEntity
}
