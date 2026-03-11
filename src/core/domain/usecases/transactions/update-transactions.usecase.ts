import { BadRequest } from '@base/core/data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { ITransaction } from '@domain/entities/transaction/transaction.entity'
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity'

export interface IUpdateTransactionDataGateway {
  updateTransaction: (id: number, transaction: IFormTransaction) => Promise<any>
}

export interface IUpdateTransactionRepository { 
  setCurrentTransaction: (transaction: ITransaction) => void
  updateTransaction: (transaction: ITransaction) => void
}

export default class UpdateTransactionUseCase {
  constructor(
    private readonly dataGateway: IUpdateTransactionDataGateway,
    private readonly dataRepository: IUpdateTransactionRepository,
    
  ) {
  }
  async execute(id: number, transactionData: IFormTransaction) {
    try {
      const newData = await this.dataGateway.updateTransaction(id, transactionData)
      this.dataRepository.updateTransaction(newData)
      this.dataRepository.setCurrentTransaction(newData)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }
}