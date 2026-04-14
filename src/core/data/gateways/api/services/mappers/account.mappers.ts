import { IAccount } from '@domain/entities/account/account.entity';
import { IAccountModel, IPagedAPIViewModel } from '@data/gateways/api/api.types'
import { IPagedAccountEntity } from '@domain/entities/account/paged.account.entity';
import { objectToCamel } from 'ts-case-convert';

export const mapAccountAttributes = (initialModel: IAccountModel) : IAccount => {
  const mapped = objectToCamel(initialModel) as any;

  if (Array.isArray(mapped.categories)) {
    mapped.categories = mapped.categories.map((category: any) => ({
      ...category,
      transactionType: category.transactionType ?? null,
      parentCategory: category.parentCategory
        ? {
          ...category.parentCategory,
          transactionType: category.parentCategory.transactionType ?? null,
          parentCategory: category.parentCategory.parentCategory ?? null
        }
        : null
    }))
  }

  return mapped as IAccount;
}

export const mapUserAccountAttributes = (initialModel: IPagedAPIViewModel<IAccountModel>): IPagedAccountEntity => {
  const accountList = initialModel.results.map((result: IAccountModel) => ({
      ...mapAccountAttributes(result)
  }));
  return {
    ...objectToCamel(initialModel),
    results: accountList,
  } as IPagedAccountEntity;
}
