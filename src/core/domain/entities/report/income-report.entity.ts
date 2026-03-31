export interface ICompanyReport {
  name: string
  grossAmount: number
  netAmount: number
}

export interface IIncomeReportData {
  month: number
  monthLabel: string
  grossAmount: number
  netAmount: number
  companies: ICompanyReport[]
}

export interface IIncomeReport {
  selectedYear: string
  compareYear: string | null
  baseData: IIncomeReportData[]
  compareData: IIncomeReportData[] | null
}

export default class IncomeReportEntity {
  selectedYear: string
  compareYear: string | null
  baseData: IIncomeReportData[]
  compareData: IIncomeReportData[] | null

  constructor(model: IIncomeReport) {
    this.selectedYear = model.selectedYear
    this.compareYear = model.compareYear
    this.baseData = model.baseData.map((month) => ({
      month: month.month,
      monthLabel: month.monthLabel,
      grossAmount: Number(month.grossAmount ?? 0),
      netAmount: Number(month.netAmount ?? 0),
      companies: month.companies.map((company) => ({
        name: company.name,
        grossAmount: Number(company.grossAmount ?? 0),
        netAmount: Number(company.netAmount ?? 0)
      }))
    }))
    this.compareData = model.compareData ? model.compareData.map((month) => ({
      month: month.month,
      monthLabel: month.monthLabel,
      grossAmount: Number(month.grossAmount ?? 0),
      netAmount: Number(month.netAmount ?? 0),
      companies: month.companies.map((company) => ({
        name: company.name,
        grossAmount: Number(company.grossAmount ?? 0),
        netAmount: Number(company.netAmount ?? 0)
      }))
    })) : null
  }

  getCurrentValuesAsJSON(): IIncomeReport {
    return Object.assign({}, this, {
      baseData: this.baseData.map((month) => ({
        ...month,
        companies: [...month.companies]
      })),
      compareData: this.compareData?.map((month) => ({
        ...month,
        companies: [...month.companies]
      }))
    })
  }
}
