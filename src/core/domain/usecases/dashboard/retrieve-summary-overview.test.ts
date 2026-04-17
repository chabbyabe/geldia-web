import { mockAPIResponses } from '@data/infra/api-mock'
import DashboardApiGateway from '@data/gateways/api/services/dashboard.gateway'
import DashboardRepository from '@data/gateways/api/services/dashboard.repository'
import RetrieveSummaryOverviewUseCase from './retrieve-summary-overview.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import { setSummaryOverview } from '@interface/presenters/store/reducers/dashboard.reducer'

describe('Test RetrieveSummaryOverviewUseCase', () => {
  let gateway: DashboardApiGateway
  let repo: DashboardRepository
  let useCase: RetrieveSummaryOverviewUseCase

  beforeEach(() => {
    gateway = new DashboardApiGateway()
    repo = new DashboardRepository()
    useCase = new RetrieveSummaryOverviewUseCase(gateway, repo)
    store.dispatch(setSummaryOverview([]))
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, {})

    await useCase.execute()

    const result = store.getState().dashboardState.summaryOverview
    expect(result.length).toBe(3)
    expect(result[0].name).toBe('Income')
    expect(result[0].amount).toBe(185489)
    expect(result[1].name).toBe('Expenses')
    expect(result[1].amount).toBe(293402)
    expect(result[2].name).toBe('Savings')
    expect(result[2].amount).toBe(49200)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute()).rejects.toThrow(FormRequestError)
    await expect(useCase.execute()).rejects.toThrow('bad-request')
    expect(store.getState().dashboardState.summaryOverview).toEqual([])
  })
})
