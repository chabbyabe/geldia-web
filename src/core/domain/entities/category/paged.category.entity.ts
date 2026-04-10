import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ICategory } from "./category.entity"

export interface IPagedCategoryEntity extends IPagedListEntity {
  results: ICategory[]
}

export default class PagedCategoryEntity extends PagedListEntity<ICategory> {
  results: ICategory[] = []

  constructor(model: IPagedCategoryEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedCategoryEntity {
    return {
      results: [...this.results],
      next: this.next ?? null,
      previous: this.previous ?? null,
      count: this.count,
      currentPageNumber: this.currentPageNumber,
      totalPages: this.totalPages
    }
  }
}
