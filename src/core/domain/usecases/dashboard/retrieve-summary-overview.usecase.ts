import { ISummary } from '@domain/entities/dashboard/summary-overview.entity'

export interface IRetrieveSummaryOverviewDataGateway {
  retrieveSummaryOverview: () => Promise<ISummary[]>
}

export interface IRetrieveSummaryOverviewRepository {
  retrieveSummaryOverview: (summaries: ISummary[]) => void
}

export default class RetrieveSummaryOverviewUseCase { 
  constructor(
    private readonly dataGateway: IRetrieveSummaryOverviewDataGateway,
    private readonly dataRepository: IRetrieveSummaryOverviewRepository,
    
  ) {
  }
  async execute() {
    const response = await this.dataGateway.retrieveSummaryOverview()
    await this.dataRepository.retrieveSummaryOverview(response)
  }
}