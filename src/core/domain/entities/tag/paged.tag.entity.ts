import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ITag } from "./tag.entity"

export interface IPagedTagEntity extends IPagedListEntity {
  results: ITag[]
}

export default class PagedTagEntity extends PagedListEntity<ITag> {
  results: ITag[] = []

  constructor(model: IPagedTagEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedTagEntity {
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
