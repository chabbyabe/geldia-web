import { faker } from '@faker-js/faker';
import AccountEntity from '@domain/entities/account/account.entity';

export const createMockAccount = (overrides = {}) => {
  return new AccountEntity({
    id: faker.number.int(),
    name: faker.finance.accountName(),
    icon: faker.string.symbol(),
    color: faker.color.rgb(),
    balance: faker.number.float({ min: 0, max: 10000 }),
    countInAssets: faker.datatype.boolean(),
    isDefault: faker.datatype.boolean(),
    isShared: faker.datatype.boolean(),
    notes: faker.lorem.sentence(),
    user: null,
    sharedUsers: [],
    hasTransactions: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    deletedAt: null,
    ...overrides,
  });
};