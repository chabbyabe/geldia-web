import { Api } from '@data/infra/api.base'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { API_URL } from '@data/gateways/api/constants'
import { IExpenseReportDataModel, IIncomeReportModel } from '@data/gateways/api/api.types'
import { mapExpenseReportAttributes, mapIncomeReportAttributes } from '@data/gateways/api/services/mappers/report.mappers'
import { IExpenseReportData } from '@domain/entities/report/expense-report.entity'
import IncomeReportEntity, { IIncomeReport } from '@domain/entities/report/income-report.entity'
import { IReportFilterParams } from '@domain/entities/report/filter.entity'
import { toQueryString } from '@data/utils/query-string.utils'

export default class ReportApiGateway extends Api {
  async retrieveIncomeReport(params: IReportFilterParams): Promise<IIncomeReport> {
    try {
      const response = await this._retrieveIncomeReport(params)
      return this._mapIncomeReportFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveIncomeReport(params: IReportFilterParams): Promise<IIncomeReportModel> {
    const filterParams = toQueryString(params)
    return await this.get(`${API_URL.REPORT.incomeReport}?${filterParams}`)
  }

  private _mapIncomeReportFromResponse(response: IIncomeReportModel): IIncomeReport {
    const data = new IncomeReportEntity(mapIncomeReportAttributes(response))
    return data.getCurrentValuesAsJSON()
  }

  async retrieveExpenseReport(params: IReportFilterParams): Promise<IExpenseReportData> {
    try {
      const response = await this._retrieveExpenseReport(params)
      return mapExpenseReportAttributes(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveExpenseReport(params: IReportFilterParams): Promise<IExpenseReportDataModel> {
    const filterParams = toQueryString(params)
    return await this.get(`${API_URL.REPORT.expenseReport}?${filterParams}`)
  }
}
