import { mockAPIResponses } from '@data/infra/api-mock'
import ReportApiGateway from '@data/gateways/api/services/report.gateway'
import ReportRepository from '@data/gateways/api/services/report.repository'
import RetrieveIncomeReportUseCase from './retrieve-income-report.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import { setIncomeReport } from '@interface/presenters/store/reducers/report.reducer'
import { IReportFilterParams } from '@domain/entities/report/filter.entity'

describe('Test RetrieveIncomeReportUseCase', () => {
  let gateway: ReportApiGateway
  let repo: ReportRepository
  let useCase: RetrieveIncomeReportUseCase

  const filterParams: IReportFilterParams = {
    selectedYear: '2026',
    compareYear: '2025'
  }

  beforeEach(() => {
    gateway = new ReportApiGateway()
    repo = new ReportRepository()
    useCase = new RetrieveIncomeReportUseCase(gateway, repo)
    store.dispatch(setIncomeReport({
      report: {
        selectedYear: '2026',
        compareYear: null,
        baseData: [],
        compareData: null
      },
      params: {
        selectedYear: '2026',
        compareYear: null
      }
    }))
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, filterParams)

    await useCase.execute(filterParams)

    const result = store.getState().reportState.incomeReport

    expect(result?.selectedYear).toBe('2026')
    expect(result?.compareYear).toBe('2025')
    expect(result?.baseData).toHaveLength(2)
    expect(result?.baseData[0].monthLabel).toBe('Jan')
    expect(result?.baseData[0].grossAmount).toBe(2500)
    expect(result?.baseData[0].companies[0].name).toBe('Acme BV')
    expect(result?.compareData).toHaveLength(1)
    expect(result?.compareData?.[0].netAmount).toBe(1900)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(filterParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(filterParams)).rejects.toThrow('bad-request')
    expect(store.getState().reportState.incomeReport?.baseData).toEqual([])
  })
})
