export interface IYearOverview {
  name: string
  label: string[]
  data: number[]
  year: string
}

export default class YearOverviewEntity {
  yearOverview: IYearOverview[]

  constructor(models: IYearOverview[]) {
    this.yearOverview = models.map(model => ({
      name: model.name,
      label: model.label ?? [],
      data: model.data ?? [],
      year: model.year
    }))
  }

  getCurrentValuesAsJSON(): IYearOverview[] {
    return [...this.yearOverview]
  }
}
