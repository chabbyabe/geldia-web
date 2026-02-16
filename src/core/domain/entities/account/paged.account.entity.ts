import { IAccount } from "@domain/entities/account/account.entity"
import PagedListEntity from "@domain/entities/base/base.paged.entity"

export interface IPagedAccountEntity {
  results: IAccount[]
  next: string | null
  previous: string | null
  totalPages: number
  count: number,
  currentPageNumber: number
}

export default class PagedAccountEntity extends PagedListEntity<IAccount> {

  constructor(model: IPagedAccountEntity | null = null) {
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

  getCurrentValuesAsJSON(): IPagedAccountEntity {
    return Object.assign({}, this);
  }
}