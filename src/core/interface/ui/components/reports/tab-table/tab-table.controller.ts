import { setReportTab } from "@interface/presenters/store/reducers/report.reducer";
import { store } from "@interface/presenters/store/store";
import ReportApiGateway from "@data/gateways/api/services/report.gateway";
import ReportRepository from "@data/gateways/api/services/report.repository";
import { IReportFilterParams } from "@domain/entities/report/filter.entity";
import RetrieveExpenseReportUseCase from "@domain/usecases/report/retrieve-expense-report.usecase";
import RetrieveIncomeReportUseCase from "@domain/usecases/report/retrieve-income-report.usecase";

export default class TabTableController {
  private readonly retrieveIncomeReportUseCase: RetrieveIncomeReportUseCase
  private readonly retrieveExpenseReportUseCase: RetrieveExpenseReportUseCase

  constructor() {
    const gateway = new ReportApiGateway()
    const repository = new ReportRepository()

    this.retrieveIncomeReportUseCase = new RetrieveIncomeReportUseCase(
      gateway,
      repository
    )
    this.retrieveExpenseReportUseCase = new RetrieveExpenseReportUseCase(
      gateway,
      repository
    )
  }

  async retrieveIncomeReport(params: IReportFilterParams) {
    await this.retrieveIncomeReportUseCase.execute(params)
  }

  async retrieveExpenseReport(params: IReportFilterParams) {
    await this.retrieveExpenseReportUseCase.execute(params)
  }

  setReportTab(tab: number) {
    store.dispatch(setReportTab(tab));
  }
}
