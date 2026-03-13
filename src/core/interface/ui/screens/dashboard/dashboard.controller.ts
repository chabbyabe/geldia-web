import RetrieveRecentTransactionsUseCase from "@base/core/domain/usecases/dashboard/retrieve-recent-transactions.usecase"
import DashboardApiGateway from "@data/gateways/api/services/dashboard.gateway"
import DashboardRepository from "@data/gateways/api/services/dashboard.repository"
import RetrieveSummaryOverviewUseCase from "@domain/usecases/dashboard/retrieve-summary-overview.usecase"
import RetrieveCategoryOverviewUseCase from "@domain/usecases/dashboard/retrieve-category-overview.usecase"

export default class DashboardController {
  private readonly retrieveSummaryOverviewUseCase: RetrieveSummaryOverviewUseCase
  private readonly retrieveRecentTransactionsUseCase: RetrieveRecentTransactionsUseCase
  private readonly retrieveCategoryOverviewUseCase: RetrieveCategoryOverviewUseCase

  constructor() {
    this.retrieveSummaryOverviewUseCase = new RetrieveSummaryOverviewUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
    )
    this.retrieveRecentTransactionsUseCase = new RetrieveRecentTransactionsUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
    )
    this.retrieveCategoryOverviewUseCase = new RetrieveCategoryOverviewUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
    )
  }

  async retrieveSummaryOverview() {
    return await this.retrieveSummaryOverviewUseCase.execute()
  }
  async retrieveRecentTransactions() {
    return await this.retrieveRecentTransactionsUseCase.execute()
  }
  async retrieveCategoryOverview() {
    return await this.retrieveCategoryOverviewUseCase.execute()
  }
}