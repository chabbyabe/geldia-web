import { IPagedCompanyEntity } from "@domain/entities/company/paged.company.entity"
import { ICompanySearchParams } from "@domain/entities/company/search.entity"

export interface IRetrieveCompaniesDataGateway {
  retrieveCompanies: (params: ICompanySearchParams) => Promise<IPagedCompanyEntity>
}

export interface IRetrieveCompaniesDataRepository {
  initializeCompanies: (companies: IPagedCompanyEntity, params: ICompanySearchParams) => void
}

export default class RetrieveCompaniesUseCase {
  constructor(
    private readonly dataGateway: IRetrieveCompaniesDataGateway,
    private readonly dataRepository: IRetrieveCompaniesDataRepository
  ) {}

  async execute(params: ICompanySearchParams) {
    const companies = await this.dataGateway.retrieveCompanies(params)
    this.dataRepository.initializeCompanies(companies, params)
  }
}
