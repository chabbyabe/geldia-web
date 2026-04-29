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
import DashboardApiGateway from "@data/gateways/api/services/dashboard.gateway"
import DashboardRepository from "@data/gateways/api/services/dashboard.repository"
import RetrieveYearOverviewUseCase from "@domain/usecases/dashboard/retrieve-year-overview.usecase"
import RetrieveCategoryOverviewUseCase from "@domain/usecases/dashboard/retrieve-category-overview.usecase"
import RetrieveSummaryOverviewUseCase from "@domain/usecases/dashboard/retrieve-summary-overview.usecase"
import { DATE_RANGES } from "@base/core/data/gateways/api/constants"

export default class TransactionsController {
  private readonly retrieveTransactionsUseCase: RetrieveTransactionsUseCase
  private readonly retrieveAccountUseCase: retrieveAccountsUseCase
  private readonly getTransactionUseCase: GetTransactionUseCase
  private readonly createTransactionUseCase: CreateTransactionUseCase
  private readonly updateTransactionUseCase: UpdateTransactionUseCase
  private readonly deleteTransactionUseCase: DeleteTransactionUseCase
  private readonly retrieveYearOverviewUseCase: RetrieveYearOverviewUseCase
  private readonly retrieveCategoryOverviewUseCase: RetrieveCategoryOverviewUseCase
  private readonly retrieveSummaryOverviewUseCase: RetrieveSummaryOverviewUseCase

  constructor() {
    const transactionGateway = new TransactionApiGateway()
    const transactionRepository = new TransactionRepository()

    const accountGateway = new AccountApiGateway()
    const accountRepository = new AccountRepository()

    const dashboardGateway = new DashboardApiGateway()
    const dashboardRepository = new DashboardRepository()

    this.retrieveTransactionsUseCase = new RetrieveTransactionsUseCase(transactionGateway, transactionRepository)
    this.retrieveAccountUseCase = new retrieveAccountsUseCase(accountGateway, accountRepository)
    this.getTransactionUseCase = new GetTransactionUseCase(transactionGateway, transactionRepository)
    this.createTransactionUseCase = new CreateTransactionUseCase(transactionGateway, transactionRepository, dashboardRepository)
    this.updateTransactionUseCase = new UpdateTransactionUseCase(transactionGateway, transactionRepository)
    this.deleteTransactionUseCase = new DeleteTransactionUseCase(transactionGateway, transactionRepository)
    this.retrieveYearOverviewUseCase = new RetrieveYearOverviewUseCase(dashboardGateway, dashboardRepository)
    this.retrieveCategoryOverviewUseCase = new RetrieveCategoryOverviewUseCase(dashboardGateway, dashboardRepository)
    this.retrieveSummaryOverviewUseCase = new RetrieveSummaryOverviewUseCase(dashboardGateway, dashboardRepository)
  }

  async retrieveTransactions(params: ITransactionSearchParams) {
    await this.retrieveTransactionsUseCase.execute(params)
    this._refreshDashboardData()
  }

  removeCurrentTransaction() {
    store.dispatch(clearCurrentTransaction())
  }

  async setCurrentTransaction(id: number) {
    await this.getTransactionUseCase.execute(id)
  }

  async createTransaction(data: IFormTransaction) {
    await this.createTransactionUseCase.execute(data)
    this._refreshDashboardData()
  }

  async updateTransaction(id: number, data: IFormTransaction) {
    await this.updateTransactionUseCase.execute(id, data)
    this._refreshDashboardData()
  }

  async deleteTransaction(transactionId: number) {
    await this.deleteTransactionUseCase.execute(transactionId)
    this._refreshDashboardData()
  }

  private async _refreshDashboardData() {
    await Promise.all([
      this.retrieveAccountUseCase.execute(),
      this.retrieveSummaryOverviewUseCase.execute(),
      this.retrieveYearOverviewUseCase.execute({ year: new Date().getFullYear().toString() }),
      this.retrieveCategoryOverviewUseCase.execute({ startDate: null, endDate: null, filterBy: DATE_RANGES.MONTH })
    ])
  }
}
