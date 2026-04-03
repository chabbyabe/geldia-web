import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ITransactionLog } from "./transaction-log.entity"

export interface IPagedTransactionLogEntity extends IPagedListEntity {
  results: ITransactionLog[]
}

export default class PagedTransactionLogEntity extends PagedListEntity<ITransactionLog> {
  results: ITransactionLog[] = []

  constructor(model: IPagedTransactionLogEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedTransactionLogEntity {
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
