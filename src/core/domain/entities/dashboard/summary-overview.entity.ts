export interface ISummary {
  name: string
  icon: string | null
  color: string | null
  amount: number
}

export default class SummaryOverviewEntity {
  summaries: ISummary[]

  constructor(models: ISummary[]) {
    this.summaries = models.map(model => ({
      name: model.name,
      icon: model.icon ?? null,
      color: model.color ?? null,
      amount: Number(model.amount),
    }))
  }

  getCurrentValuesAsJSON(): ISummary[] {
    return [...this.summaries]
  }
}
