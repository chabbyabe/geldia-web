import { Api } from '@data/infra/api.base'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { API_URL } from '@data/gateways/api/constants'
import SummaryEntity, { ISummary } from '@domain/entities/dashboard/summary-overview.entity'
import { mapSummaryOverviewAttributes, mapRecentTransactionAttributes, mapCategoryOverviewAttributes } from '@data/gateways/api/services/mappers/dashboard.mappers'
import { ICategoryOverviewModel, ISummaryModel, ITransactionModel } from '@data/gateways/api/api.types'
import TransactionEntity, { ITransaction } from '@domain/entities/transaction/transaction.entity'
import CategoryOverviewEntity, { ICategoryOverview } from '@domain/entities/dashboard/category-overview.entity'

export default class DashboardApiGateway extends Api {
  async retrieveSummaryOverview(): Promise<ISummary[]> {
    try {
      const response = await this._retrieveSummaryOverview()
      return this._mapSummaryOverviewFromResponse(response);
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveSummaryOverview(): Promise<ISummaryModel[]> {
    return await this.get(API_URL.DASHBOARD.summaryOverview)
  }

  private _mapSummaryOverviewFromResponse(response: ISummaryModel[]): ISummary[] {
    const data = new SummaryEntity(mapSummaryOverviewAttributes(response));
    return data.getCurrentValuesAsJSON();
  }

  async retrieveRecentTransactions(): Promise<ITransaction[]> {
    try {
      const response = await this._retrieveRecentTransactions()
      return TransactionEntity.fromArray(mapRecentTransactionAttributes(response));
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveRecentTransactions(): Promise<ITransactionModel[]> {
    return await this.get(API_URL.DASHBOARD.recentTransactions)
  }

  async retrieveCategoryOverview(): Promise<ICategoryOverview[]> {
    try {
      const response = await this._retrieveCategoryOverview()
      return this._mapCategoryOverviewFromResponse(response);
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveCategoryOverview(): Promise<ICategoryOverviewModel[]> {
    return await this.get(API_URL.DASHBOARD.categoryOverview)
  }

  private _mapCategoryOverviewFromResponse(response: ICategoryOverviewModel[]): ICategoryOverview[] {
    const data = new CategoryOverviewEntity(mapCategoryOverviewAttributes(response));
    return data.getCurrentValuesAsJSON();
  }

}