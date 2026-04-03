import { IPagedAPIViewModel, ITransactionLogModel } from "@data/gateways/api/api.types"
import { API_URL } from "@data/gateways/api/constants"
import { mapPagedTransactionLogAttributes } from "@data/gateways/api/services/mappers/log.mappers"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { IPagedTransactionLogEntity } from "@domain/entities/log/paged-transaction-log.entity"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import PagedTransactionLogEntity from "@domain/entities/log/paged-transaction-log.entity"

export default class LogsTransactionApiGateway extends Api {
  async retrieveLogs(params: ILogSearchParams): Promise<IPagedTransactionLogEntity> {
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

  private async _retrieveLogs(params: ILogSearchParams): Promise<IPagedAPIViewModel<ITransactionLogModel>> {
    return await this.get(API_URL.LOGS.transactions, params)
  }

  private _mapPageFromResponse(response: IPagedAPIViewModel<ITransactionLogModel>): IPagedTransactionLogEntity {
    const logs = new PagedTransactionLogEntity(mapPagedTransactionLogAttributes(response))
    return logs.getCurrentValuesAsJSON()
  }
}
