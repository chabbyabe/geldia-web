import { clearCurrentTransaction } from "@interface/presenters/store/reducers/transactions.reducer"
import { store } from "@interface/presenters/store/store"
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity"
import TransactionApiGateway from "@data/gateways/api/services/transaction.gateway"
import TransactionRepository from "@data/gateways/api/services/transaction.repository"
import RetrieveTransactionsUseCase from "@domain/usecases/transactions/retrieve-transactions.usecase"
import GetTransactionUseCase from "@domain/usecases/transactions/get-transaction.usecase"

export default class TransactionsController {

  private readonly retrieveTransactionsUseCase: RetrieveTransactionsUseCase
  private readonly getTransactionUseCase: GetTransactionUseCase

  constructor() {
    this.retrieveTransactionsUseCase = new RetrieveTransactionsUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.getTransactionUseCase = new GetTransactionUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
  }

  async retrieveTransactions(params : ITransactionSearchParams) {
    await this.retrieveTransactionsUseCase.execute(params)
  }

  removeCurrentTransaction() {
    store.dispatch(clearCurrentTransaction())
  }

  async setCurrentTransaction(id: number) {
     await this.getTransactionUseCase.execute(id)
  }
}