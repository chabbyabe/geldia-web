import PagedListEntity, { IPagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ICompany } from "./company.entity"

export interface IPagedCompanyEntity extends IPagedListEntity {
  results: ICompany[]
}

export default class PagedCompanyEntity extends PagedListEntity<ICompany> {
  results: ICompany[] = []

  constructor(model: IPagedCompanyEntity | null) {
    super(model)
    if (model) {
      this.results = model.results
    }
  }

  getCurrentValuesAsJSON(): IPagedCompanyEntity {
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
