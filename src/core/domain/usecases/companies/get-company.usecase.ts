import { ICompany } from "@domain/entities/company/company.entity"

export interface IGetCompanyDataGateway {
  getCompany: (companyId?: number) => Promise<ICompany>
}

export interface IGetCompanyDataRepository {
  setCurrentCompany: (company: ICompany) => void
}

export default class GetCompanyUseCase {
  constructor(
    private readonly dataGateway: IGetCompanyDataGateway,
    private readonly dataRepository: IGetCompanyDataRepository
  ) {}

  async execute(companyId: number) {
    const company = await this.dataGateway.getCompany(companyId)
    this.dataRepository.setCurrentCompany(company)
  }
}
