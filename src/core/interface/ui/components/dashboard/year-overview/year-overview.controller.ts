import { IYearOverviewFilterParams } from "@domain/entities/dashboard/filter.entity"
import DashboardApiGateway from "@data/gateways/api/services/dashboard.gateway"
import DashboardRepository from "@data/gateways/api/services/dashboard.repository"
import RetrieveYearOverviewUseCase from "@domain/usecases/dashboard/retrieve-year-overview.usecase"

export default class YearOverviewController {
  private readonly retrieveYearOverviewUseCase: RetrieveYearOverviewUseCase

  constructor() {

    this.retrieveYearOverviewUseCase = new RetrieveYearOverviewUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
    )
  }

  async retrieveYearOverview(params: IYearOverviewFilterParams) {
    return await this.retrieveYearOverviewUseCase.execute(params)
  }
}