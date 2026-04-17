import { ICategoryOverview } from '@domain/entities/dashboard/category-overview.entity'
import { faker } from '@faker-js/faker'

export const createMockCategoryOverviewList = (
  count: number = 5,
  overrides?: Partial<ICategoryOverview>,
): ICategoryOverview[] => {
  return Array.from({ length: count }, () =>
    createMockCategoryOverview(overrides ?? {}),
  )
}

export const createMockCategoryOverview = (
  overrides: Partial<ICategoryOverview> = {},
): ICategoryOverview => {
  const amount = faker.number.float({ min: 5, max: 500 })

  return {
    name: faker.commerce.department(),
    icon: faker.helpers.arrayElement([
      'Savings',
      'Transfer',
      'Food',
      'Shopping',
      'Home',
      'Car',
      'Health',
    ]),
    color: faker.color.rgb(),
    isParent: faker.datatype.boolean(),
    amount,
    ...overrides,
  }
}