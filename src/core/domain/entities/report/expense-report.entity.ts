export interface IExpenseReportMonthData {
  month: number
  date: string
  categories: Record<string, string>
  total: string
}

export interface IExpenseReportData {
  selectedYear: string
  compareYear: string | null
  baseData: IExpenseReportMonthData[]
  compareData: IExpenseReportMonthData[] | null
}

export default class ExpenseReportEntity {
  selectedYear: string
  compareYear: string | null
  baseData: IExpenseReportMonthData[]
  compareData: IExpenseReportMonthData[] | null

  constructor(model: IExpenseReportData) {
    this.selectedYear = model.selectedYear
    this.compareYear = model.compareYear
    this.baseData = model.baseData.map((month) => ({
      month: month.month,
      date: month.date,
      categories: { ...(month.categories ?? {}) },
      total: month.total
    }))
    this.compareData = model.compareData
      ? model.compareData.map((month) => ({
          month: month.month,
          date: month.date,
          categories: { ...(month.categories ?? {}) },
          total: month.total
        }))
      : null
  }

  getCurrentValuesAsJSON(): IExpenseReportData {
    return Object.assign({}, this, {
      baseData: this.baseData.map((month) => ({
        ...month,
        categories: { ...month.categories }
      })),
      compareData: this.compareData?.map((month) => ({
        ...month,
        categories: { ...month.categories }
      }))
    })
  }
}
