import { ITransaction } from '@domain/entities/transaction/transaction.entity'
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity'

export interface ICreateTransactionDataGateway {
  createTransaction: (transaction: IFormTransaction) => Promise<any>
}

export interface ICreateTransactionRepository {
  setTransaction: (transaction: ITransaction) => void
}

export default class CreateTransactionUseCase {
  constructor(
    private readonly dataGateway: ICreateTransactionDataGateway,
    private readonly dataRepository: ICreateTransactionRepository,
    
  ) {
  }
  async execute(transactionData: IFormTransaction) {
    const newData = await this.dataGateway.createTransaction(transactionData)

    await this.dataRepository.setTransaction(newData)
  }
}