import { mockAPIResponses } from '@data/infra/api-mock'
import TransactionApiGateway from '@data/gateways/api/services/transaction.gateway'
import TransactionRepository from '@data/gateways/api/services/transaction.repository'
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

describe('Test GetTransactionUseCase', () => {
  let gateway: TransactionApiGateway
  let repo: TransactionRepository
  let useCase: GetTransactionUseCase

  const optionsData = createMockTransactionFormOption();
  const transactionData = {
    transactionId: 52,
    transactionForm: createMockTransactionForm({
      name: 'Rent',
      amount: 850,
      netAmount: 850,
      grossAmount: 850,
      category: optionsData.categories[0].name,
      transactionType: optionsData.transactionTypes[0].id,
      tags: [optionsData.tags[0].name],
      store: optionsData.stores[0].name,
      place: optionsData.places[0].name,
      isRecurring: true,
      debitMonthYear: '2026-03',
      transactionAt: '2026-03-01T00:00:00.000Z',
    }),
  }

  beforeEach(() => {
    gateway = new TransactionApiGateway()
    repo = new TransactionRepository()
    useCase = new GetTransactionUseCase(gateway, repo)

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
    await useCase.execute(52)

    const current = store.getState().transactionState.currentTransaction
    expect(current?.id).toBe(52)
    expect(current?.name).toBe(transactionData.transactionForm.name)
    expect(current?.amount).toBe(transactionData.transactionForm.amount)
    expect(current?.account?.id).toBe(transactionData.transactionForm.account)
    expect(current?.category?.name).toBe(transactionData.transactionForm.category)
    expect(current?.tags?.[0].name).toBe(transactionData.transactionForm.tags?.[0])
    expect(current?.transactionType?.id).toBe(transactionData.transactionForm.transactionType)
    expect(current?.store?.name).toBe(transactionData.transactionForm.store)
    expect(current?.place?.name).toBe(transactionData.transactionForm.place)
    expect(current?.isRecurring).toBe(true)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(52)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(52)).rejects.toThrow('bad-request')
    expect(store.getState().transactionState.currentTransaction).toBeNull()
  })
})
