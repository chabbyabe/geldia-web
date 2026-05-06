import AuthApiGateway from '@data/gateways/api/services/auth.gateway'
import AuthRepository from '@data/gateways/api/services/auth.repository'
import CompanyApiGateway from '@data/gateways/api/services/company.gateway'
import CompanyRepository from '@data/gateways/api/services/company.repository'
import ChangePasswordUseCase from '@domain/usecases/auth/change-password.usecase'
import ConfirmEmailVerificationUseCase from '@domain/usecases/auth/confirm-email-verification.usecase'
import CreateCompanyUseCase from '@domain/usecases/companies/create-company.usecase'
import DeleteCompanyUseCase from '@domain/usecases/companies/delete-company.usecase'
import GetCompanyUseCase from '@domain/usecases/companies/get-company.usecase'
import RequestEmailVerificationUseCase from '@domain/usecases/auth/request-email-verification.usecase'
import RetrieveCompaniesUseCase from '@domain/usecases/companies/retrieve-companies.usecase'
import RetrieveCurrentUserUseCase from '@domain/usecases/auth/retrieve-current-user.usecase'
import UpdateCompanyUseCase from '@domain/usecases/companies/update-company.usecase'
import { IFormCompany } from '@domain/entities/formModels/company-form.entity'
import UpdateCurrentUserUseCase from '@domain/usecases/user/update-current-user.usecase'
import { IFormEmailVerification, IFormPasswordReset, IFormPersonalInformation } from '@domain/entities/formModels/settings-form.entity'
import { ICompanySearchParams } from '@domain/entities/company/search.entity'
import { ICompany } from '@domain/entities/company/company.entity'
import { formatToTitleCase } from '@interface/presenters/helpers'

export default class SettingsController {
  private readonly updateCurrentUserUseCase: UpdateCurrentUserUseCase
  private readonly changePasswordUseCase: ChangePasswordUseCase
  private readonly retrieveCurrentUserUseCase: RetrieveCurrentUserUseCase
  private readonly requestEmailVerificationUseCase: RequestEmailVerificationUseCase
  private readonly confirmEmailVerificationUseCase: ConfirmEmailVerificationUseCase
  private readonly retrieveCompaniesUseCase: RetrieveCompaniesUseCase
  private readonly createCompanyUseCase: CreateCompanyUseCase
  private readonly updateCompanyUseCase: UpdateCompanyUseCase
  private readonly deleteCompanyUseCase: DeleteCompanyUseCase
  private readonly getCompanyUseCase: GetCompanyUseCase
  private readonly companyRepository: CompanyRepository

  constructor() {
    const authGateway = new AuthApiGateway()
    const companyGateway = new CompanyApiGateway()
    this.companyRepository = new CompanyRepository()

    this.updateCurrentUserUseCase = new UpdateCurrentUserUseCase(
      authGateway,
      new AuthRepository()
    )
    this.changePasswordUseCase = new ChangePasswordUseCase(authGateway)
    this.retrieveCurrentUserUseCase = new RetrieveCurrentUserUseCase(
      authGateway,
      new AuthRepository()
    )
    this.requestEmailVerificationUseCase = new RequestEmailVerificationUseCase(authGateway)
    this.confirmEmailVerificationUseCase = new ConfirmEmailVerificationUseCase(authGateway)
    this.retrieveCompaniesUseCase = new RetrieveCompaniesUseCase(
      companyGateway,
      this.companyRepository
    )
    this.createCompanyUseCase = new CreateCompanyUseCase(
      companyGateway,
      this.companyRepository
    )
    this.updateCompanyUseCase = new UpdateCompanyUseCase(
      companyGateway,
      this.companyRepository
    )
    this.deleteCompanyUseCase = new DeleteCompanyUseCase(
      companyGateway,
      this.companyRepository
    )
    this.getCompanyUseCase = new GetCompanyUseCase(
      companyGateway,
      this.companyRepository
    )
  }

  async updatePersonalInformation(data: IFormPersonalInformation) {
    return await this.updateCurrentUserUseCase.execute(data)
  }

  async changePassword(data: IFormPasswordReset) {
    return await this.changePasswordUseCase.execute(data)
  }

  async refreshCurrentUser() {
    return await this.retrieveCurrentUserUseCase.execute()
  }

  async requestEmailVerification() {
    return await this.requestEmailVerificationUseCase.execute()
  }

  async confirmEmailVerification(data: IFormEmailVerification) {
    return await this.confirmEmailVerificationUseCase.execute(data)
  }

  async retrieveCompanies(params: ICompanySearchParams) {
    await this.retrieveCompaniesUseCase.execute(params)
  }

  clearCurrentCompany() {
    this.companyRepository.clearCurrentCompany()
  }

  async setCurrentCompany(id: number) {
    await this.getCompanyUseCase.execute(id)
  }

  private normalizeCompanyPayload(data: IFormCompany): IFormCompany {
    return {
      ...data,
      name: formatToTitleCase(data.name.trim()),
      joinedAt: data.joinedAt || null,
      resignedAt: data.isCurrent ? null : data.resignedAt || null
    }
  }

  async createCompany(data: IFormCompany) {
    await this.createCompanyUseCase.execute(this.normalizeCompanyPayload(data))
  }

  async updateCompany(id: number, data: IFormCompany) {
    await this.updateCompanyUseCase.execute(id, this.normalizeCompanyPayload(data))
  }

  async deleteCompany(item: ICompany) {
    await this.deleteCompanyUseCase.execute(item.id)
  }
}
