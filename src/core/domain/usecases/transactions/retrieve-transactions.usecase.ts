import { IPagedTransactionEntity } from "@domain/entities/transaction/paged.transaction.entity"
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity"


export interface IRetrieveTransactionsDataGateway {
  retrieveTransactions: (params: ITransactionSearchParams) => Promise<any>
}

export interface IRetrieveTransactionsDataRepository {
  initializeTransactions: (transactions: IPagedTransactionEntity, searchParams: ITransactionSearchParams) => void
}

export default class RetrieveTransactionsUseCase {
  constructor(
    private readonly dataGateway: IRetrieveTransactionsDataGateway,
    private readonly dataRepository: IRetrieveTransactionsDataRepository,
  ) {
  }
  async execute(params: ITransactionSearchParams) {
    try {
      const userTransaction = await this.dataGateway.retrieveTransactions(params)
      this.dataRepository.initializeTransactions(userTransaction,params)
    } catch (error: any) {
      throw error
    }
  }
}