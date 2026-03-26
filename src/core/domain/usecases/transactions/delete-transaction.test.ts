import { mockAPIResponses } from '@data/infra/api-mock'
import TransactionApiGateway from '@data/gateways/api/services/transaction.gateway'
import TransactionRepository from '@data/gateways/api/services/transaction.repository'
import DeleteTransactionUseCase from './delete-transaction.usecase'
import GetTransactionUseCase from './get-transaction.usecase'
import RetrieveTransactionsUseCase from './retrieve-transactions.usecase'
import { BadRequest } from '@data/infra/api.error'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentTransaction,
  initializeTransactions,
  retrieveFormInitialData,
} from '@interface/presenters/store/reducers/transactions.reducer'
import { createMockTransactionForm } from '@core/test/mocks/transaction.mock'
import { createMockTransactionFormOption } from '@core/test/mocks/form-option.mock'

describe('Test DeleteTransactionUseCase', () => {
  let gateway: TransactionApiGateway
  let repo: TransactionRepository
  let useCase: DeleteTransactionUseCase

  const optionsData = createMockTransactionFormOption()
  const transactionData = {
    transactionId: 71,
    transactionForm: createMockTransactionForm({
      name: 'Subscription',
      amount: 15,
      netAmount: 15,
      grossAmount: 15,
      store: optionsData.stores[0].name,
      place: optionsData.places[0].name,
      category: optionsData.categories[0].name,
      transactionType: optionsData.transactionTypes[0].id,
      tags: [optionsData.tags[0].name],
      notes: null,
      isRecurring: true,
      debitMonthYear: '2026-03',
      transactionAt: '2026-03-08T00:00:00.000Z',
    }),
  }

  beforeEach(() => {
    gateway = new TransactionApiGateway()
    repo = new TransactionRepository()
    useCase = new DeleteTransactionUseCase(gateway, repo)

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
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, transactionData)

    await new RetrieveTransactionsUseCase(gateway, repo).execute({
      page: 1,
      search: '',
      ordering: '',
      filterModel: '',
    })
    await new GetTransactionUseCase(gateway, repo).execute(71)

    expect(store.getState().transactionState.currentTransaction?.id).toBe(71)

    await useCase.execute(71)

    const state = store.getState().transactionState
    const deleted = state.transactions.find((item) => item.id === 71)
    expect(deleted).toBeUndefined()
    expect(state.currentTransaction).toBeNull()
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, transactionData)

    await new RetrieveTransactionsUseCase(gateway, repo).execute({
      page: 1,
      search: '',
      ordering: '',
      filterModel: '',
    })
    await new GetTransactionUseCase(gateway, repo).execute(71)

    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(71)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(71)).rejects.toThrow('bad-request')

    const state = store.getState().transactionState
    expect(state.transactions.find((item) => item.id === 71)?.name).toBe(
      transactionData.transactionForm.name,
    )
    expect(state.currentTransaction?.id).toBe(71)
  })
})
