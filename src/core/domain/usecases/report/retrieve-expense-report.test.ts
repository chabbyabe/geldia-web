import { mockAPIResponses } from '@data/infra/api-mock'
import ReportApiGateway from '@data/gateways/api/services/report.gateway'
import ReportRepository from '@data/gateways/api/services/report.repository'
import RetrieveExpenseReportUseCase from './retrieve-expense-report.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import { setExpenseReport } from '@interface/presenters/store/reducers/report.reducer'
import { IReportFilterParams } from '@domain/entities/report/filter.entity'

describe('Test RetrieveExpenseReportUseCase', () => {
  let gateway: ReportApiGateway
  let repo: ReportRepository
  let useCase: RetrieveExpenseReportUseCase

  const filterParams: IReportFilterParams = {
    selectedYear: '2026',
    compareYear: null
  }

  beforeEach(() => {
    gateway = new ReportApiGateway()
    repo = new ReportRepository()
    useCase = new RetrieveExpenseReportUseCase(gateway, repo)
    store.dispatch(setExpenseReport(null))
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, filterParams)

    await useCase.execute(filterParams)

    const result = store.getState().reportState.expenseReport

    expect(result?.selectedYear).toBe('2026')
    expect(result?.compareYear).toBe('2025')
    expect(result?.baseData).toHaveLength(12)
    expect(result?.baseData[1].date).toBe('Feb')
    expect(result?.baseData[1].categories['New Category']).toBe('€27,500.00')
    expect(result?.baseData[2].total).toBe('€119,886.00')
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(filterParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(filterParams)).rejects.toThrow('bad-request')
    expect(store.getState().reportState.expenseReport).toBeNull()
  })
})
