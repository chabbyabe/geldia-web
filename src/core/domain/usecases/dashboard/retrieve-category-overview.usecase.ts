import { ICategoryOverview } from '@domain/entities/dashboard/category-overview.entity'
import { ICategoryOverviewFilterParams } from '@domain/entities/dashboard/filter.entity'

export interface IRetrieveCategoryOverviewDataGateway {
  retrieveCategoryOverview: (params: ICategoryOverviewFilterParams) => Promise<ICategoryOverview[]>
}

export interface IRetrieveCategoryOverviewRepository {
  retrieveCategoryOverview: (categories: ICategoryOverview[], params: ICategoryOverviewFilterParams) => void
}

export default class RetrieveCategoryOverviewUseCase { 
  constructor(
    private readonly dataGateway: IRetrieveCategoryOverviewDataGateway,
    private readonly dataRepository: IRetrieveCategoryOverviewRepository,
    
  ) {
  }
  async execute(params: ICategoryOverviewFilterParams) {
    const response = await this.dataGateway.retrieveCategoryOverview(params)
    await this.dataRepository.retrieveCategoryOverview(response, params)
  }
}