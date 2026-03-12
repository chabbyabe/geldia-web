import DashboardApiGateway from "@data/gateways/api/services/dashboard.gateway"
import DashboardRepository from "@data/gateways/api/services/dashboard.repository"
import RetrieveSummaryOverviewUseCase from "@domain/usecases/dashboard/retrieve-summary-overview.usecase"

export default class DashboardController {
  private readonly retrieveSummaryOverviewUseCase: RetrieveSummaryOverviewUseCase

  constructor() {
    this.retrieveSummaryOverviewUseCase = new RetrieveSummaryOverviewUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
    )
  }

  async retrieveSummaryOverview() {
    return await this.retrieveSummaryOverviewUseCase.execute()
  }
}