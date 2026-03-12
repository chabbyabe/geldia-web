import { ITransaction } from '@domain/entities/transaction/transaction.entity'

export interface IRetrieveRecentTransactionsDataGateway {
  retrieveRecentTransactions: () => Promise<ITransaction[]>
}

export interface IRetrieveRecentTransactionsRepository {
  retrieveRecentTransactions: (transactions: ITransaction[]) => void
}

export default class RetrieveRecentTransactionsUseCase { 
  constructor(
    private readonly dataGateway: IRetrieveRecentTransactionsDataGateway,
    private readonly dataRepository: IRetrieveRecentTransactionsRepository,
  ) {
  }
  async execute() {
    const response = await this.dataGateway.retrieveRecentTransactions()
    await this.dataRepository.retrieveRecentTransactions(response)
  }
}