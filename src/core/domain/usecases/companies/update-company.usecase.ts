import { IFormCompany } from "@domain/entities/formModels/company-form.entity"
import { ICompany } from "@domain/entities/company/company.entity"

export interface IUpdateCompanyDataGateway {
  updateCompany: (id: number, company: IFormCompany) => Promise<ICompany>
}

export interface IUpdateCompanyRepository {
  updateCompany: (company: ICompany) => void
  setCurrentCompany: (company: ICompany) => void
}

export default class UpdateCompanyUseCase {
  constructor(
    private readonly dataGateway: IUpdateCompanyDataGateway,
    private readonly dataRepository: IUpdateCompanyRepository
  ) {}

  async execute(id: number, companyData: IFormCompany) {
    const updatedCompany = await this.dataGateway.updateCompany(id, companyData)
    this.dataRepository.updateCompany(updatedCompany)
    this.dataRepository.setCurrentCompany(updatedCompany)
  }
}
