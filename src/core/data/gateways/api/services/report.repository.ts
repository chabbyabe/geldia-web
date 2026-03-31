import { IExpenseReportData } from "@domain/entities/report/expense-report.entity"
import { IIncomeReport } from "@domain/entities/report/income-report.entity"
import { IReportFilterParams } from "@domain/entities/report/filter.entity"
import { setExpenseReport, setIncomeReport } from "@interface/presenters/store/reducers/report.reducer"
import { store } from "@interface/presenters/store/store"

export default class ReportRepository {
  setIncomeReport(report: IIncomeReport, params: IReportFilterParams) {
    store.dispatch(setIncomeReport({ report, params }))
  }

  setExpenseReport(report: IExpenseReportData) {
    store.dispatch(setExpenseReport(report))
  }
}
