import { IIncomeReport } from '@domain/entities/report/income-report.entity'
import { IReportFilterParams } from '@domain/entities/report/filter.entity'

export interface IRetrieveIncomeReportDataGateway {
  retrieveIncomeReport: (params: IReportFilterParams) => Promise<IIncomeReport>
}

export interface IRetrieveIncomeReportRepository {
  setIncomeReport: (report: IIncomeReport, params: IReportFilterParams) => void
}

export default class RetrieveIncomeReportUseCase {
  constructor(
    private readonly dataGateway: IRetrieveIncomeReportDataGateway,
    private readonly dataRepository: IRetrieveIncomeReportRepository,
  ) { }

  async execute(params: IReportFilterParams) {
    try {
      const response = await this.dataGateway.retrieveIncomeReport(params)
      await this.dataRepository.setIncomeReport(response, params)
    } catch (error: any) {
      throw error
    }
  }
}
