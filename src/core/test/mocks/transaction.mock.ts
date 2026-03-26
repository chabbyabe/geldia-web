import { faker } from '@faker-js/faker'
import { TRANSACTION_TYPE } from '@data/gateways/api/constants'
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity'

export const createMockTransactionForm = (
  overrides: Partial<IFormTransaction> = {},
): IFormTransaction => {
  const transactionType = overrides.transactionType ?? faker.helpers.arrayElement([
    TRANSACTION_TYPE.INCOME.id,
    TRANSACTION_TYPE.EXPENSES.id,
  ])

  return {
    name: faker.commerce.productName(),
    user: 1,
    account: 201,
    store: faker.company.name(),
    place: faker.location.city(),
    category:
      transactionType === TRANSACTION_TYPE.INCOME.id
        ? TRANSACTION_TYPE.INCOME.name
        : TRANSACTION_TYPE.EXPENSES.name,
    tags: [faker.word.noun()],
    transactionType,
    amount: 1000,
    notes: faker.lorem.sentence(),
    netAmount: 1000,
    grossAmount: 1000,
    debitMonthYear: '2026-03',
    externalTransactionId: null,
    pairTransaction: null,
    isRecurring: false,
    isRefunded: false,
    refundedAt: null,
    transactionAt: '2026-03-15T00:00:00.000Z',
    ...overrides,
  }
}