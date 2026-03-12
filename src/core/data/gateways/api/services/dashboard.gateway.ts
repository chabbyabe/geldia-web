import { Api } from '@data/infra/api.base'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { DASHBOARD_URL } from '@data/gateways/api/constants'
import SummaryEntity, { ISummary } from '@domain/entities/dashboard/summary-overview.entity'
import { mapSummaryOverviewAttributes } from '@data/gateways/api/services/mappers/dashboard.mappers'
import { ISummaryModel } from '@data/gateways/api/api.types'

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
    return await this.get(`${DASHBOARD_URL}summary-overview/`)
  }

  private _mapSummaryOverviewFromResponse(response: ISummaryModel[]): ISummary[] {
    const data = new SummaryEntity(mapSummaryOverviewAttributes(response));
    return data.getCurrentValuesAsJSON();
  }
}