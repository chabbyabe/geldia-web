import { IYearOverview } from '@domain/entities/dashboard/year-overview.entity'

export interface IRetrieveYearOverviewDataGateway {
  retrieveYearOverview: () => Promise<IYearOverview[]>
}

export interface IRetrieveYearOverviewRepository {
  setYearOverview: (overview: IYearOverview[]) => void
}

export default class RetrieveYearOverviewUseCase { 
  constructor(
    private readonly dataGateway: IRetrieveYearOverviewDataGateway,
    private readonly dataRepository: IRetrieveYearOverviewRepository,
    
  ) {
  }
  async execute() {
    const response = await this.dataGateway.retrieveYearOverview()
    await this.dataRepository.setYearOverview(response)
  }
}