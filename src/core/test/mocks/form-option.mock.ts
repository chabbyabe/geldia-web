import { faker } from '@faker-js/faker'
import TransactionInitialFormEntity, { ITransactionInitial } from '@domain/entities/transaction/initial.entity'
import { TRANSACTION_TYPE } from '@data/gateways/api/constants'

export const createMockTransactionFormOption = (
  overrides: Partial<ITransactionInitial> = {},
): ITransactionInitial => {
  const transactionTypeId = faker.helpers.arrayElement([
    TRANSACTION_TYPE.INCOME.id,
    TRANSACTION_TYPE.EXPENSES.id,
  ])
  const transactionType = {
    id: transactionTypeId,
    name:
      transactionTypeId === TRANSACTION_TYPE.INCOME.id
        ? TRANSACTION_TYPE.INCOME.name
        : TRANSACTION_TYPE.EXPENSES.name,
    icon: null,
    color: faker.color.rgb(),
  }

  return new TransactionInitialFormEntity({
    stores: [
      {
        id: faker.number.int({ min: 1, max: 1000 }),
        name: faker.company.name(),
      },
    ],
    places: [
      {
        id: faker.number.int({ min: 1, max: 1000 }),
        name: faker.location.city(),
      },
    ],
    accounts: [
      {
        id: faker.number.int({ min: 100, max: 999 }),
        name: faker.finance.accountName(),
        balance: faker.number.float({ min: 0, max: 10000}),
        icon: null,
        color: faker.color.rgb(),
        isDefault: faker.datatype.boolean(),
        userId: faker.number.int({ min: 1, max: 1000 }),
      },
    ],
    categories: [
      {
        id: faker.number.int({ min: 200, max: 999 }),
        name: faker.commerce.department(),
        icon: null,
        color: faker.color.rgb(),
        transactionType: transactionType,
        parentCategory: null,
      },
    ],
    transactionTypes: [transactionType],
    tags: [
      {
        id: faker.number.int({ min: 1, max: 100 }),
        name: faker.word.noun(),
        color: faker.color.rgb(),
      },
    ],
    ...overrides,
  })
}
