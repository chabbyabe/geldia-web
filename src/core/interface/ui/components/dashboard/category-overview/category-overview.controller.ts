import { ICategoryOverviewFilterParams } from "@base/core/domain/entities/dashboard/filter.entity"
import DashboardApiGateway from "@data/gateways/api/services/dashboard.gateway"
import DashboardRepository from "@data/gateways/api/services/dashboard.repository"
import RetrieveCategoryOverviewUseCase from "@domain/usecases/dashboard/retrieve-category-overview.usecase"

export default class CategoryOverviewController {
  private readonly retrieveCategoryOverviewUseCase: RetrieveCategoryOverviewUseCase

  constructor() {

    this.retrieveCategoryOverviewUseCase = new RetrieveCategoryOverviewUseCase(
      new DashboardApiGateway(),
      new DashboardRepository()
    )
  }

  async retrieveCategoryOverview(params: ICategoryOverviewFilterParams) {
    return await this.retrieveCategoryOverviewUseCase.execute(params)
  }
}