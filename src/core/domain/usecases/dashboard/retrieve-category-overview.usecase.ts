import { ICategoryOverview } from '@domain/entities/dashboard/category-overview.entity'

export interface IRetrieveCategoryOverviewDataGateway {
  retrieveCategoryOverview: () => Promise<ICategoryOverview[]>
}

export interface IRetrieveCategoryOverviewRepository {
  retrieveCategoryOverview: (categories: ICategoryOverview[]) => void
}

export default class RetrieveCategoryOverviewUseCase { 
  constructor(
    private readonly dataGateway: IRetrieveCategoryOverviewDataGateway,
    private readonly dataRepository: IRetrieveCategoryOverviewRepository,
    
  ) {
  }
  async execute() {
    const response = await this.dataGateway.retrieveCategoryOverview()
    await this.dataRepository.retrieveCategoryOverview(response)
  }
}