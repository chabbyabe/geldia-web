export interface IExpenseReportCategory {
  amount: number
  name: string
  color: string | null
}
export interface IExpenseReportParentCategory {
  categories: Record<string, IExpenseReportCategory>
  total: number
}

export interface IExpenseReportMonthData {
  month: number
  date: string
  parentCategories: Record<string, IExpenseReportParentCategory>
  total: number
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
      parentCategories: Object.fromEntries(
        Object.entries(month.parentCategories ?? {}).map(([parentCategory, categoryData]) => [
          parentCategory,
          {
            categories: { ...(categoryData.categories ?? {}) },
            total: Number(categoryData.total ?? 0)
          }
        ])
      ),
      total: Number(month.total ?? 0)
    }))
    this.compareData = model.compareData
      ? model.compareData.map((month) => ({
          month: month.month,
          date: month.date,
          parentCategories: Object.fromEntries(
            Object.entries(month.parentCategories ?? {}).map(([parentCategory, categoryData]) => [
              parentCategory,
              {
                categories: { ...(categoryData.categories ?? {}) },
                total: Number(categoryData.total ?? 0)
              }
            ])
          ),
          total: Number(month.total ?? 0)
        }))
      : null
  }

  getCurrentValuesAsJSON(): IExpenseReportData {
    return Object.assign({}, this, {
      baseData: this.baseData.map((month) => ({
        ...month,
        parentCategories: Object.fromEntries(
          Object.entries(month.parentCategories ?? {}).map(([parentCategory, categoryData]) => [
            parentCategory,
            {
              categories: { ...categoryData.categories },
              total: categoryData.total
            }
          ])
        )
      })),
      compareData: this.compareData?.map((month) => ({
        ...month,
        parentCategories: Object.fromEntries(
          Object.entries(month.parentCategories ?? {}).map(([parentCategory, categoryData]) => [
            parentCategory,
            {
              categories: { ...categoryData.categories },
              total: categoryData.total
            }
          ])
        )
      }))
    })
  }
}
