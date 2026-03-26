import { mockAPIResponses } from '@data/infra/api-mock'
import DashboardApiGateway from '@data/gateways/api/services/dashboard.gateway'
import DashboardRepository from '@data/gateways/api/services/dashboard.repository'
import RetrieveRecentTransactionsUseCase from './retrieve-recent-transactions.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import { setRecentTransactions } from '@interface/presenters/store/reducers/dashboard.reducer'
import { createMockTransactionForm } from '@core/test/mocks/transaction.mock'

describe('Test RetrieveRecentTransactionsUseCase', () => {
  let gateway: DashboardApiGateway
  let repo: DashboardRepository
  let useCase: RetrieveRecentTransactionsUseCase

  const recentTransactionsData = {
    transactions: [
      {
        transactionId: 81,
        transactionForm: createMockTransactionForm({
          name: 'Coffee',
          amount: 5,
          netAmount: 5,
          grossAmount: 5,
          category: 'Food',
          transactionType: 2,
          tags: ['Daily'],
          store: 'Cafe',
          place: 'Amsterdam',
        }),
      },
      {
        transactionId: 82,
        transactionForm: createMockTransactionForm({
          name: 'Salary',
          amount: 2000,
          netAmount: 2000,
          grossAmount: 2000,
          category: 'Income',
          transactionType: 1,
          tags: ['Work'],
          store: 'Employer',
          place: 'Amsterdam',
        }),
      },
    ],
  }

  beforeEach(() => {
    gateway = new DashboardApiGateway()
    repo = new DashboardRepository()
    useCase = new RetrieveRecentTransactionsUseCase(gateway, repo)
    store.dispatch(setRecentTransactions([]))
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, recentTransactionsData)

    await useCase.execute()
    
    const result = store.getState().dashboardState.recentTransactions
    expect(result.length).toBe(2)
    expect(result[0].id).toBe(81)
    expect(result[0].name).toBe('Coffee')
    expect(result[0].amount).toBe(5)
    expect(result[0].transactionType?.name).toBe('Expenses')
    expect(result[1].id).toBe(82)
    expect(result[1].name).toBe('Salary')
    expect(result[1].amount).toBe(2000)
    expect(result[1].transactionType?.name).toBe('Income')
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute()).rejects.toThrow(FormRequestError)
    await expect(useCase.execute()).rejects.toThrow('bad-request')
    expect(store.getState().dashboardState.recentTransactions).toEqual([])
  })
})
