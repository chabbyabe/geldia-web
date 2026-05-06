import { IPagedCompanyEntity } from "@domain/entities/company/paged.company.entity"
import { ICompanySearchParams } from "@domain/entities/company/search.entity"
import { ICompany } from "@domain/entities/company/company.entity"
import { store } from "@interface/presenters/store/store"
import {
  addNewCompany,
  clearCurrentCompany,
  deleteCompany,
  initializeCompanies,
  setCurrentCompany,
  updateCompany
} from "@interface/presenters/store/reducers/companies.reducer"

export default class CompanyRepository {
  initializeCompanies(companies: IPagedCompanyEntity, params: ICompanySearchParams) {
    store.dispatch(initializeCompanies({ companies, searchParams: params }))
  }

  setCurrentCompany(item: ICompany) {
    store.dispatch(setCurrentCompany(item))
  }

  clearCurrentCompany() {
    store.dispatch(clearCurrentCompany())
  }

  setCompany(item: ICompany) {
    store.dispatch(addNewCompany(item))
  }

  updateCompany(item: ICompany) {
    store.dispatch(updateCompany(item))
  }

  deleteCompany() {
    store.dispatch(deleteCompany())
  }
}
