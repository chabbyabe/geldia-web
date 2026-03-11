import { ITransactionModel, IPagedAPIViewModel, ITransactionFormInitialDataModel } from '@data/gateways/api/api.types'
import { Api } from '@data/infra/api.base'
import { TRANSACTION_URL } from '@data/gateways/api/constants'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity'
import TransactionEntity, { ITransaction } from '@domain/entities/transaction/transaction.entity'
import { mapPagedTransactionAttributes, mapTransactionAttributes, mapTransactionFormInitialDataAttributes } from './mappers/transaction.mappers'
import PagedTransactionEntity, { IPagedTransactionEntity } from '@domain/entities/transaction/paged.transaction.entity'
import { mapErrorAttributes } from './mappers/error.mappers'
import { ITransactionInitial } from '@domain/entities/transaction/initial.entity'
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

  // Set retrieve selected transaction (For transaction edit)
  async getTransaction(transactionId?: number): Promise<ITransaction> {
    try {
      const response = await this._getTransaction(transactionId)
      return this._mapTransactionFromResponse(response)
    } catch (error) {
      throw error
    }
  }

  private async _getTransaction(transactionId?: number): Promise<ITransactionModel>{
      return await this.get(TRANSACTION_URL + `${transactionId}/`)
  }

    // Create a new transaction
  async createTransaction(transactionDetail: IFormTransaction): Promise<ITransaction> {
    try {
      const response = await this._createTransaction(transactionDetail)
      return this._mapTransactionFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        const errorData = mapErrorAttributes(error.data)
        throw new FormRequestError(error.message, errorData)
      }
      throw error
    }
  }

  private _mapTransactionFromResponse(response: ITransactionModel): ITransaction {
    const transaction = new TransactionEntity(mapTransactionAttributes(response))
    return transaction.getCurrentValuesAsJSON()
  }

  private async _createTransaction(transactionDetail: IFormTransaction) : Promise<ITransactionModel> {
    return await this.post(TRANSACTION_URL, transactionDetail)
  }

  // Update transaction
  async updateTransaction(id: number, transactionDetail: IFormTransaction): Promise<ITransaction> {
    try {
      const response = await this._updateTransaction(id, transactionDetail)
      return this._mapTransactionFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        const errorData = mapErrorAttributes(error.data)
        throw new FormRequestError(error.message, errorData)
      }
      throw error
    }
  }

  private async _updateTransaction(id: number,transactionDetail: IFormTransaction) : Promise<ITransactionModel> {
    return await this.patch(TRANSACTION_URL + `${id}/`, transactionDetail)
  }

  // Delete transaction
  async deleteTransaction(transactionId: number) : Promise<void> {
    return await this.delete(TRANSACTION_URL + `${transactionId}/`)
  }

  // Get transactions form initial data 
  async retrieveFormInitialData(): Promise<ITransactionInitial> {
    try {
      const response = await this._retrieveFormInitialData()
      return this._mapInitialDataFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveFormInitialData(): Promise<ITransactionFormInitialDataModel> {
    return await this.get(`${TRANSACTION_URL}initial/list/`)
  }

  private _mapInitialDataFromResponse(response: ITransactionFormInitialDataModel): ITransactionInitial {
    return mapTransactionFormInitialDataAttributes(response);
  }
}