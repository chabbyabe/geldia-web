import { IYearOverview } from '@domain/entities/dashboard/year-overview.entity'
import { IYearOverviewFilterParams } from '@domain/entities/dashboard/filter.entity'

export interface IRetrieveYearOverviewDataGateway {
  retrieveYearOverview: (params: IYearOverviewFilterParams) => Promise<IYearOverview[]>
}

export interface IRetrieveYearOverviewRepository {
  setYearOverview: (overview: IYearOverview[], params: IYearOverviewFilterParams) => void
}

export default class RetrieveYearOverviewUseCase { 
  constructor(
    private readonly dataGateway: IRetrieveYearOverviewDataGateway,
    private readonly dataRepository: IRetrieveYearOverviewRepository,
    
  ) {
  }
  async execute(params: IYearOverviewFilterParams) {
    const response = await this.dataGateway.retrieveYearOverview(params)
    await this.dataRepository.setYearOverview(response, params)
  }
}