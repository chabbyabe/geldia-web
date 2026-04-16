import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IExpenseReportData } from "@domain/entities/report/expense-report.entity";
import { IIncomeReport } from "@domain/entities/report/income-report.entity";
import { IReportFilterParams } from "@domain/entities/report/filter.entity";
import dayjs from "dayjs";

interface IReportState {
  incomeReport: IIncomeReport | null
  expenseReport: IExpenseReportData | null
  filters: IReportFilterParams
  reportTab: number
}

const initialState: IReportState = {
  incomeReport: null,
  expenseReport: null,
  filters: {
      selectedYear: dayjs().format("YYYY"),
      compareYear: null
  },
  reportTab: 1,
}

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportTab(state, action: PayloadAction<number>) {
      state.reportTab = action.payload;
    },
    setIncomeReport(state, action: PayloadAction<{
      report: IIncomeReport,
      params: IReportFilterParams
    }>) {
      state.incomeReport = action.payload.report
      state.filters = {
        selectedYear: action.payload.params.selectedYear,
        compareYear: action.payload.params.compareYear ?? null
      }
    },
    setExpenseReport(state, action: PayloadAction<IExpenseReportData | null>) {
      state.expenseReport = action.payload
    },
  },
})

export const {
  setReportTab,
  setIncomeReport,
  setExpenseReport
} = reportSlice.actions
export default reportSlice.reducer
