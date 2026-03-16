
export interface ISummary {
  name: string
  icon: string | null
  color: string | null
  amount: number
  formattedAmount: string
}

export default class SummaryOverviewEntity {
  summaries: ISummary[]

  constructor(models: ISummary[]) {
    this.summaries = models.map(model => ({
      name: model.name,
      icon: model.icon ?? null,
      color: model.color ?? null,
      amount: Number(model.amount),
      formattedAmount: model.formattedAmount
    }))
  }

  getCurrentValuesAsJSON(): ISummary[] {
    return [...this.summaries]
  }

  static mock(overrides: Partial<ISummary> = {}): SummaryOverviewEntity {
    const mockData: ISummary[] = [
      {
        name: 'Test Summary',
        icon: 'Savings',
        color: '#006CD1',
        amount: 12.0,
        formattedAmount: '€12.00',
        ...overrides
      }
    ]
    return new SummaryOverviewEntity(mockData)
  }
}
