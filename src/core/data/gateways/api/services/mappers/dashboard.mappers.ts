import { ISummary } from '@base/core/domain/entities/dashboard/summary-overview.entity';
import { ITransaction } from '@base/core/domain/entities/transaction/transaction.entity';
import { ISummaryModel, ITransactionModel } from '@data/gateways/api/api.types'
import { objectToCamel } from 'ts-case-convert';
import { mapTransactionAttributes } from './transaction.mappers';

export const mapSummaryOverviewAttributes = (initialModel: ISummaryModel[]): ISummary[] => {
  return [...objectToCamel(initialModel)];
}

export const mapRecentTransactionAttributes = (initialModel: ITransactionModel[]): ITransaction[] => {
  const transactions = initialModel.map((result: ITransactionModel) => ({
    ...mapTransactionAttributes(result)
  }));
  return transactions;
}
