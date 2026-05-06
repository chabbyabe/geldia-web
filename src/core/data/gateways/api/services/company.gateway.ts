import { COMPANY_URL } from "@data/gateways/api/constants"
import { ICompanyModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormCompany } from "@domain/entities/formModels/company-form.entity"
import PagedCompanyEntity, { IPagedCompanyEntity } from "@domain/entities/company/paged.company.entity"
import CompanyEntity, { ICompany } from "@domain/entities/company/company.entity"
import { ICompanySearchParams } from "@domain/entities/company/search.entity"
import { mapErrorAttributes } from "./mappers/error.mappers"
import { mapCompanyAttributes, mapPagedCompanyAttributes } from "./mappers/company.mappers"

export default class CompanyApiGateway extends Api {
  async retrieveCompanies(params: ICompanySearchParams): Promise<IPagedCompanyEntity> {
    try {
      const response = await this._retrieveCompanies(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  async getCompany(companyId?: number): Promise<ICompany> {
    const response = await this._getCompany(companyId)
    return this._mapCompanyFromResponse(response)
  }

  async createCompany(companyData: IFormCompany): Promise<ICompany> {
    try {
      const response = await this._createCompany(companyData)
      return this._mapCompanyFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async updateCompany(id: number, companyData: IFormCompany): Promise<ICompany> {
    try {
      const response = await this._updateCompany(id, companyData)
      return this._mapCompanyFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async deleteCompany(companyId: number): Promise<void> {
    await this.delete(COMPANY_URL + `${companyId}/`)
  }

  private async _retrieveCompanies(
    params: ICompanySearchParams
  ): Promise<IPagedAPIViewModel<ICompanyModel> | ICompanyModel[]> {
    return await this.get(COMPANY_URL, params)
  }

  private async _getCompany(companyId?: number): Promise<ICompanyModel> {
    return await this.get(COMPANY_URL + `${companyId}/`)
  }

  private async _createCompany(companyData: IFormCompany): Promise<ICompanyModel> {
    return await this.post(COMPANY_URL, companyData)
  }

  private async _updateCompany(id: number, companyData: IFormCompany): Promise<ICompanyModel> {
    return await this.patch(COMPANY_URL + `${id}/`, companyData)
  }

  private _mapPageFromResponse(
    response: IPagedAPIViewModel<ICompanyModel> | ICompanyModel[]
  ): IPagedCompanyEntity {
    const companies = new PagedCompanyEntity(mapPagedCompanyAttributes(response))
    return companies.getCurrentValuesAsJSON()
  }

  private _mapCompanyFromResponse(response: ICompanyModel): ICompany {
    const company = new CompanyEntity(mapCompanyAttributes(response))
    return company.getCurrentValuesAsJSON()
  }
}
