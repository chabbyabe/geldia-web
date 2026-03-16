import { clearCurrentTransaction } from "@interface/presenters/store/reducers/transactions.reducer"
import { store } from "@interface/presenters/store/store"
import { IFormTransaction } from "@domain/entities/formModels/transaction-form.entity"
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity"
import retrieveAccountsUseCase from "@domain/usecases/accounts/retrieve-accounts.usecase"
import AccountApiGateway from "@base/core/data/gateways/api/services/account.gateway"
import AccountRepository from "@base/core/data/gateways/api/services/account.repository"
import TransactionApiGateway from "@data/gateways/api/services/transaction.gateway"
import TransactionRepository from "@data/gateways/api/services/transaction.repository"
import RetrieveTransactionsUseCase from "@domain/usecases/transactions/retrieve-transactions.usecase"
import GetTransactionUseCase from "@domain/usecases/transactions/get-transaction.usecase"
import CreateTransactionUseCase from "@domain/usecases/transactions/create-transaction.usecase"
import UpdateTransactionUseCase from "@base/core/domain/usecases/transactions/update-transactions.usecase"
import DeleteTransactionUseCase from "@base/core/domain/usecases/transactions/delete-transaction.usecase"
import RetrieveRecentTransactionsUseCase from "@domain/usecases/dashboard/retrieve-recent-transactions.usecase"
import DashboardApiGateway from "@data/gateways/api/services/dashboard.gateway"
import DashboardRepository from "@data/gateways/api/services/dashboard.repository"

export default class TransactionsController {

  private readonly retrieveTransactionsUseCase: RetrieveTransactionsUseCase
  private readonly retrieveAccountUseCase: retrieveAccountsUseCase
  private readonly getTransactionUseCase: GetTransactionUseCase
  private readonly createTransactionUseCase: CreateTransactionUseCase
  private readonly updateTransactionUseCase: UpdateTransactionUseCase
  private readonly deleteTransactionUseCase: DeleteTransactionUseCase
  private readonly retrieveRecentTransactionsUseCase: RetrieveRecentTransactionsUseCase
  constructor() {
    this.retrieveTransactionsUseCase = new RetrieveTransactionsUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.retrieveAccountUseCase = new retrieveAccountsUseCase(
      new AccountApiGateway(),
      new AccountRepository()
    )
    this.getTransactionUseCase = new GetTransactionUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.createTransactionUseCase = new CreateTransactionUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.updateTransactionUseCase = new UpdateTransactionUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.deleteTransactionUseCase = new DeleteTransactionUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.retrieveRecentTransactionsUseCase = new RetrieveRecentTransactionsUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
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

  async createTransaction(data: IFormTransaction) {
    await this.createTransactionUseCase.execute(data)
    await this.retrieveRecentTransactionsUseCase.execute()
    await this.retrieveAccountUseCase.execute(true, 1)
  }

  async updateTransaction(id: number, data: IFormTransaction) {
    await this.updateTransactionUseCase.execute(id, data)
    await this.retrieveAccountUseCase.execute(true, 1)
  }

 async deleteTransaction(transactionId: number) {
     await this.deleteTransactionUseCase.execute(transactionId)
  }
}