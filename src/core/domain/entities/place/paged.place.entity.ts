import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IPlace } from "./place.entity"

export interface IPagedPlaceEntity extends IPagedListEntity {
  results: IPlace[]
}

export default class PagedPlaceEntity extends PagedListEntity<IPlace> {
  results: IPlace[] = []

  constructor(model: IPagedPlaceEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedPlaceEntity {
    return {
      results: [...this.results],
      next: this.next ?? null,
      previous: this.previous ?? null,
      count: this.count,
      currentPageNumber: this.currentPageNumber,
      totalPages: this.totalPages,
    }
  }
}
