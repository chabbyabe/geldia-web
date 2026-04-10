import { ITagModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { IPagedTagEntity } from "@domain/entities/tag/paged.tag.entity"
import { ITag } from "@domain/entities/tag/tag.entity"
import { objectToCamel } from "ts-case-convert"

export const mapTagAttributes = (initialModel: ITagModel): ITag => {
  return objectToCamel(initialModel) as ITag
}

export const mapPagedTagAttributes = (
  initialModel: IPagedAPIViewModel<ITagModel>
): IPagedTagEntity => {
  const tagList = initialModel.results.map((result: ITagModel) => ({
    ...mapTagAttributes(result)
  }))

  return {
    ...objectToCamel(initialModel),
    results: tagList
  } as IPagedTagEntity
}
