import RetrieveYearOverviewUseCase from './retrieve-year-overview.usecase'
import { mockAPIResponses } from '@data/infra/api-mock'
import DashboardApiGateway from '@data/gateways/api/services/dashboard.gateway'
import DashboardRepository from '@data/gateways/api/services/dashboard.repository'
import { store } from '@interface/presenters/store/store'
import { setYearOverview } from '@interface/presenters/store/reducers/dashboard.reducer'
import { IYearOverviewFilterParams } from '@domain/entities/dashboard/filter.entity'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'

describe('Test RetrieveYearOverviewUseCase', () => {
  let gateway: DashboardApiGateway
  let repo: DashboardRepository
  let useCase: RetrieveYearOverviewUseCase

  let filterParams : IYearOverviewFilterParams = { year: '2026' }

  beforeEach(() => {
    gateway = new DashboardApiGateway()
    repo = new DashboardRepository()
    useCase = new RetrieveYearOverviewUseCase(gateway, repo)
    store.dispatch(setYearOverview({ overview: [], params: filterParams }))
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, filterParams)

    await useCase.execute(filterParams)

    const result = store.getState().dashboardState.yearOverview

    expect(result[0].name).toBe('Income');
    expect(result[0].year).toBe('2026');
    expect(result[0].label).toEqual([
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ]);
    expect(Array.isArray(result[0].data)).toBe(true);

    expect(result[1].name).toBe('Expenses');
    expect(result[1].year).toBe('2026');
    expect(result[1].label).toEqual([
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ]);
    expect(Array.isArray(result[1].data)).toBe(true);
  })


  test('Execute with error when year is more than three years', async () => {
    const simulatedError = "Year must be between 2023 and 2029."

    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(filterParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(filterParams)).rejects.toThrow('bad-request')
    expect(store.getState().dashboardState.yearOverview).toEqual([])
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(filterParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(filterParams)).rejects.toThrow('bad-request')
    expect(store.getState().dashboardState.yearOverview).toEqual([])
  })
})
