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
}
