import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IStore } from "./store.entity"

export interface IPagedStoreEntity extends IPagedListEntity {
  results: IStore[]
}

export default class PagedStoreEntity extends PagedListEntity<IStore> {
  results: IStore[] = []

  constructor(model: IPagedStoreEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedStoreEntity {
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
