import { clearCurrentTransaction } from "@interface/presenters/store/reducers/transactions.reducer"
import { store } from "@interface/presenters/store/store"
import TransactionApiGateway from "@data/gateways/api/services/transaction.gateway"
import TransactionRepository from "@data/gateways/api/services/transaction.repository"
import RetrieveTransactionsUseCase from "@domain/usecases/transactions/retrieve-transactions.usecase"
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity"
export default class TransactionsController {

  private readonly retrieveTransactionsUseCase: RetrieveTransactionsUseCase

  constructor() {
    this.retrieveTransactionsUseCase = new RetrieveTransactionsUseCase(
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

}