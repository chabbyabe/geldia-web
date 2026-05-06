import { IFormCompany } from "@domain/entities/formModels/company-form.entity"
import { ICompany } from "@domain/entities/company/company.entity"

export interface ICreateCompanyDataGateway {
  createCompany: (company: IFormCompany) => Promise<ICompany>
}

export interface ICreateCompanyRepository {
  setCompany: (company: ICompany) => void
}

export default class CreateCompanyUseCase {
  constructor(
    private readonly dataGateway: ICreateCompanyDataGateway,
    private readonly dataRepository: ICreateCompanyRepository
  ) {}

  async execute(companyData: IFormCompany) {
    const newCompany = await this.dataGateway.createCompany(companyData)
    this.dataRepository.setCompany(newCompany)
  }
}
