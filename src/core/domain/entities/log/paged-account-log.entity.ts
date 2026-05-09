import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IAccountLog } from "./account-log.entity"

export interface IPagedAccountLogEntity extends IPagedListEntity {
  results: IAccountLog[]
}

export default class PagedAccountLogEntity extends PagedListEntity<IAccountLog> {
  results: IAccountLog[] = []

  constructor(model: IPagedAccountLogEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedAccountLogEntity {
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
