export interface IDeleteCompanyDataGateway {
  deleteCompany: (companyId: number) => Promise<void>
}

export interface IDeleteCompanyDataRepository {
  deleteCompany: () => void
}

export default class DeleteCompanyUseCase {
  constructor(
    private readonly dataGateway: IDeleteCompanyDataGateway,
    private readonly dataRepository: IDeleteCompanyDataRepository
  ) {}

  async execute(companyId: number) {
    await this.dataGateway.deleteCompany(companyId)
    this.dataRepository.deleteCompany()
  }
}
