import { ISummary } from "@domain/entities/dashboard/summary-overview.entity"

export interface ICategoryOverview extends ISummary {
  isParent: boolean
}

export default class CategoryOverviewEntity {
  categories: ICategoryOverview[]

  constructor(models: ICategoryOverview[]) {
    this.categories = models.map(model => ({
      name: model.name,
      icon: model.icon ?? null,
      color: model.color ?? null,
      isParent: model.isParent,
      amount: Number(model.amount),
      formattedAmount: model.formattedAmount
    }))
  }

  getCurrentValuesAsJSON(): ICategoryOverview[] {
    return [...this.categories]
  }

  static mock(overrides: Partial<ICategoryOverview> = {}): CategoryOverviewEntity {
    const mockData: ICategoryOverview[] = [
      {
        name: 'Test Summary',
        icon: 'Savings',
        color: '#006CD1',
        isParent: false,
        amount: 12.0,
        formattedAmount: '€12.00',
        ...overrides
      }
    ]
    return new CategoryOverviewEntity(mockData)
  }
}
