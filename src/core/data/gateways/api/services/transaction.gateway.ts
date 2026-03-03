import { ITransactionModel, IPagedAPIViewModel } from '@data/gateways/api/api.types'
import { Api } from '@data/infra/api.base'
import { TRANSACTION_URL } from '@data/gateways/api/constants'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { mapPagedTransactionAttributes } from './mappers/transaction.mappers'
import PagedTransactionEntity, { IPagedTransactionEntity } from '@domain/entities/transaction/paged.transaction.entity'
import { ITransactionSearchParams } from '@domain/entities/transaction/search.entity'

export default class TransactionApiGateway extends Api {

  // Get user own transactions
  async retrieveTransactions(params: ITransactionSearchParams): Promise<IPagedTransactionEntity> {
    try {
      const response = await this._retrieveTransactions(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveTransactions(params: ITransactionSearchParams): Promise<IPagedAPIViewModel<ITransactionModel>> {
    return await this.get(TRANSACTION_URL, params)
  }

  private _mapPageFromResponse(response: IPagedAPIViewModel<ITransactionModel>): IPagedTransactionEntity {
    const transactions = new PagedTransactionEntity(mapPagedTransactionAttributes(response))
    return transactions.getCurrentValuesAsJSON()
  }
}