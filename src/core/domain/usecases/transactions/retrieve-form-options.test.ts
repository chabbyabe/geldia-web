import { mockAPIResponses } from '@data/infra/api-mock'
import TransactionApiGateway from '@data/gateways/api/services/transaction.gateway'
import TransactionRepository from '@data/gateways/api/services/transaction.repository'
import RetrieveTransactionFormOptionsUseCase from './retrieve-form-options.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentTransaction,
  initializeTransactions,
  retrieveFormInitialData,
} from '@interface/presenters/store/reducers/transactions.reducer'
import { createMockTransactionFormOption } from '@core/test/mocks/form-option.mock'

describe('Test RetrieveTransactionFormOptionsUseCase', () => {
  let gateway: TransactionApiGateway
  let repo: TransactionRepository
  let useCase: RetrieveTransactionFormOptionsUseCase

  const optionsData = createMockTransactionFormOption();

  beforeEach(() => {
    gateway = new TransactionApiGateway()
    repo = new TransactionRepository()
    useCase = new RetrieveTransactionFormOptionsUseCase(gateway, repo)

    store.dispatch(
      initializeTransactions({
        transactions: {
          results: [],
          next: null,
          previous: null,
          count: 0,
          totalPages: 1,
          currentPageNumber: 1,
        },
        searchParams: {
          page: 1,
          search: '',
          ordering: '',
          filterModel: '',
        },
      }),
    )
    store.dispatch(clearCurrentTransaction())
    store.dispatch(
      retrieveFormInitialData({
        categories: [],
        places: [],
        stores: [],
        accounts: [],
        transactionTypes: [],
        tags: [],
      }),
    )
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, optionsData)

    await useCase.execute()

    const options = store.getState().transactionState.options
    expect(options.stores[0].name).toBe(optionsData.stores[0].name)
    expect(options.places[0].name).toBe(optionsData.places[0].name)
    expect(options.accounts[0].id).toBe(optionsData.accounts[0].id)
    expect(options.categories[0].name).toBe(optionsData.categories[0].name)
    expect(options.transactionTypes[0].name).toBe(optionsData.transactionTypes[0].name)
    expect(options.tags[0].name).toBe(optionsData.tags[0].name)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute()).rejects.toThrow(FormRequestError)
    await expect(useCase.execute()).rejects.toThrow('bad-request')

    const options = store.getState().transactionState.options
    expect(options.stores).toEqual([])
    expect(options.places).toEqual([])
    expect(options.accounts).toEqual([])
    expect(options.categories).toEqual([])
    expect(options.transactionTypes).toEqual([])
    expect(options.tags).toEqual([])
  })
})
