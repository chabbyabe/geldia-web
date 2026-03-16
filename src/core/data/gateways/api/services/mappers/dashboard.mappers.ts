import { ISummary } from '@base/core/domain/entities/dashboard/summary-overview.entity';
import { ITransaction } from '@base/core/domain/entities/transaction/transaction.entity';
import { ICategoryOverviewModel, ISummaryModel, ITransactionModel, IYearOverviewModel } from '@data/gateways/api/api.types'
import { objectToCamel } from 'ts-case-convert';
import { mapTransactionAttributes } from './transaction.mappers';
import { ICategoryOverview } from '@domain/entities/dashboard/category-overview.entity';
import { IYearOverview } from '@domain/entities/dashboard/year-overview.entity';

export const mapSummaryOverviewAttributes = (initialModel: ISummaryModel[]): ISummary[] => {
  return [...objectToCamel(initialModel)];
}

export const mapRecentTransactionAttributes = (initialModel: ITransactionModel[]): ITransaction[] => {
  const transactions = initialModel.map((result: ITransactionModel) => ({
    ...mapTransactionAttributes(result)
  }));
  return transactions;
}

export const mapCategoryOverviewAttributes = (initialModel: ICategoryOverviewModel[]): ICategoryOverview[] => {
  return [...objectToCamel(initialModel)];
}

export const mapYearOverviewAttributes = (initialModel: IYearOverviewModel[]): IYearOverview[] => {
  return [...objectToCamel(initialModel)];
}
