import { ITransaction } from "@domain/entities/transaction/transaction.entity"

export interface IGetTransactionDataGateway {
  getTransaction: (page?: number) => Promise<any>
}

export interface IGetTransactionDataRepository {
  setCurrentTransaction: (transaction: ITransaction) => void
}

export default class GetTransactionUseCase {
  constructor(
    private readonly dataGateway: IGetTransactionDataGateway,
    private readonly dataRepository: IGetTransactionDataRepository,
  ) {
  }
  async execute(transactionId: number) {
    try {
      const Transaction = await this.dataGateway.getTransaction(transactionId)
        await this.dataRepository.setCurrentTransaction(Transaction)
    } catch (error: any) {
      throw error
    }
  }
}