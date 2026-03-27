export interface IYearOverview {
  name: string
  label: string[]
  data: number[]
  year: string
  isGross?: boolean
}

export default class YearOverviewEntity {
  yearOverview: IYearOverview[]

  constructor(models: IYearOverview[]) {
    this.yearOverview = models.map(model => ({
      name: model.name,
      label: model.label ?? [],
      data: model.data ?? [],
      year: model.year,
      isGross: model.isGross
    }))
  }

  getCurrentValuesAsJSON(): IYearOverview[] {
    return [...this.yearOverview]
  }
}
