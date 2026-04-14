import { IPlaceModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { IPagedPlaceEntity } from "@domain/entities/place/paged.place.entity"
import { IPlace } from "@domain/entities/place/place.entity"
import { objectToCamel } from "ts-case-convert"

export const mapPlaceAttributes = (initialModel: IPlaceModel): IPlace => {
  return objectToCamel(initialModel) as IPlace
}

export const mapPagedPlaceAttributes = (
  initialModel: IPagedAPIViewModel<IPlaceModel>
): IPagedPlaceEntity => {
  const list = initialModel.results.map((result: IPlaceModel) => ({
    ...mapPlaceAttributes(result)
  }))

  return {
    ...objectToCamel(initialModel),
    results: list
  } as IPagedPlaceEntity
}
