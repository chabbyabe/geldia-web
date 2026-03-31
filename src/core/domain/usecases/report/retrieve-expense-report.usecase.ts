import { IExpenseReportData } from '@domain/entities/report/expense-report.entity'
import { IReportFilterParams } from '@domain/entities/report/filter.entity'

export interface IRetrieveExpenseReportDataGateway {
  retrieveExpenseReport: (params: IReportFilterParams) => Promise<IExpenseReportData>
}

export interface IRetrieveExpenseReportRepository {
  setExpenseReport: (report: IExpenseReportData) => void
}

export default class RetrieveExpenseReportUseCase {
  constructor(
    private readonly dataGateway: IRetrieveExpenseReportDataGateway,
    private readonly dataRepository: IRetrieveExpenseReportRepository,
  ) { }

  async execute(params: IReportFilterParams) {
    const response = await this.dataGateway.retrieveExpenseReport(params)
    await this.dataRepository.setExpenseReport(response)
  }
}
