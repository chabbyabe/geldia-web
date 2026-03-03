import PagedListEntity from "@domain/entities/base/base.paged.entity"
import { ITransaction } from "@domain/entities/transaction/transaction.entity"

export interface IPagedTransactionEntity {
  results: ITransaction[]
  next: string | null
  previous: string | null
  totalPages: number
  count: number,
  currentPageNumber: number
}

export default class PagedTransactionEntity extends PagedListEntity<ITransaction> {

  constructor(model: IPagedTransactionEntity | null = null) {
    super(model);
    if (model !== null) {
      this.results = model.results;
      this.count = model.count;
      this.next = model.next ?? '';
      this.previous = model.previous ?? '';
      this.totalPages = model.totalPages;
      this.currentPageNumber = model.currentPageNumber;
    }
  }

  getCurrentValuesAsJSON(): IPagedTransactionEntity {
    return Object.assign({}, this);
  }
}