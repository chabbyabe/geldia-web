import { ICategoryModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { IPagedCategoryEntity } from "@domain/entities/category/paged.category.entity"
import { ICategory } from "@domain/entities/category/category.entity"
import { objectToCamel } from "ts-case-convert"

export const mapCategoryAttributes = (initialModel: ICategoryModel): ICategory => {
  return objectToCamel(initialModel) as ICategory
}

export const mapPagedCategoryAttributes = (
  initialModel: IPagedAPIViewModel<ICategoryModel>
): IPagedCategoryEntity => {
  const categoryList = initialModel.results.map((result: ICategoryModel) => ({
    ...mapCategoryAttributes(result)
  }))

  return {
    ...objectToCamel(initialModel),
    results: categoryList
  } as IPagedCategoryEntity
}
