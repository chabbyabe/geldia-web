import { IAccountLogModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { API_URL } from "@data/gateways/api/constants"
import { mapPagedAccountLogAttributes } from "@data/gateways/api/services/mappers/log.mappers"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IPagedAccountLogEntity } from "@domain/entities/log/paged-account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import PagedAccountLogEntity from "@domain/entities/log/paged-account-log.entity"

export default class LogsAccountApiGateway extends Api {
  async retrieveLogs(params: ILogSearchParams): Promise<IPagedAccountLogEntity> {
    try {
      const response = await this._retrieveLogs(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveLogs(params: ILogSearchParams): Promise<IPagedAPIViewModel<IAccountLogModel>> {
    return await this.get(API_URL.LOGS.accounts, params)
  }

  private _mapPageFromResponse(response: IPagedAPIViewModel<IAccountLogModel>): IPagedAccountLogEntity {
    const logs = new PagedAccountLogEntity(mapPagedAccountLogAttributes(response))
    return logs.getCurrentValuesAsJSON()
  }
}
