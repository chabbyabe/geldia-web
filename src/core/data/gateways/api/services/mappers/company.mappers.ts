import { ICompanyModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { IPagedCompanyEntity } from "@domain/entities/company/paged.company.entity"
import { ICompany } from "@domain/entities/company/company.entity"
import { objectToCamel } from "ts-case-convert"

export const mapCompanyAttributes = (initialModel: ICompanyModel): ICompany => {
  return objectToCamel(initialModel) as ICompany
}

export const mapPagedCompanyAttributes = (
  initialModel: IPagedAPIViewModel<ICompanyModel> | ICompanyModel[]
): IPagedCompanyEntity => {
  const normalizedResults = Array.isArray(initialModel)
    ? initialModel
    : initialModel.results

  const companyList = normalizedResults.map((result: ICompanyModel) => ({
    ...mapCompanyAttributes(result)
  }))

  if (Array.isArray(initialModel)) {
    return {
      results: companyList,
      next: null,
      previous: null,
      count: companyList.length,
      currentPageNumber: 1,
      totalPages: 1
    }
  }

  return {
    ...objectToCamel(initialModel),
    results: companyList
  } as IPagedCompanyEntity
}
