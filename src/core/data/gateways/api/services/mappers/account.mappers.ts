import { IAccount } from '@domain/entities/account/account.entity';
import { IAccountModel, IPagedAPIViewModel } from '@data/gateways/api/api.types'
import { IPagedAccountEntity } from '@domain/entities/account/paged.account.entity';
import { objectToCamel } from 'ts-case-convert';

export const mapAccountAttributes = (initialModel: IAccountModel) : IAccount => {
  return objectToCamel(initialModel) as IAccount;
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