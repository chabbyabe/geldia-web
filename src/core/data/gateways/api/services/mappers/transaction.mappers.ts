import { ITransactionInitial } from '@domain/entities/transaction/initial.entity';
import { IPagedTransactionEntity } from '@domain/entities/transaction/paged.transaction.entity';
import { ITransactionModel, IPagedAPIViewModel, ITransactionFormInitialDataModel} from '@data/gateways/api/api.types'
import { IAccountSimple, ICategorySimple, IPlaceSimple, IStoreSimple, ITagSimple, ITransaction, ITransactionType} from '@domain/entities/transaction/transaction.entity';
import { objectToCamel } from 'ts-case-convert';

export const mapTransactionAttributes = (initialModel: ITransactionModel) : ITransaction => {
  return objectToCamel(initialModel) as ITransaction
}

export const mapPagedTransactionAttributes = (initialModel: IPagedAPIViewModel<ITransactionModel>): IPagedTransactionEntity => {
    const transactions = initialModel.results.map((result: ITransactionModel) => ({
        ...mapTransactionAttributes(result)
    }));
  return {
    ...objectToCamel(initialModel),
    results: transactions,
  } as IPagedTransactionEntity;
}

export const mapTransactionFormInitialDataAttributes = (initialModel: ITransactionFormInitialDataModel): ITransactionInitial => {
  return {
    stores: objectToCamel(initialModel.stores) as IStoreSimple[],
    places: objectToCamel(initialModel.places) as IPlaceSimple[],
    accounts: objectToCamel(initialModel.accounts) as IAccountSimple[],
    categories: objectToCamel(initialModel.categories) as ICategorySimple[],
    transactionTypes: objectToCamel(initialModel.transaction_types) as ITransactionType[],
    tags: objectToCamel(initialModel.tags) as ITagSimple[],
  };
};
