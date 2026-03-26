import { mockAPIResponses } from '@data/infra/api-mock'
import TransactionApiGateway from '@data/gateways/api/services/transaction.gateway'
import TransactionRepository from '@data/gateways/api/services/transaction.repository'
import RetrieveTransactionsUseCase from './retrieve-transactions.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentTransaction,
  initializeTransactions,
  retrieveFormInitialData,
} from '@interface/presenters/store/reducers/transactions.reducer'
import { createMockTransactionForm } from '@core/test/mocks/transaction.mock'
import { createMockTransactionFormOption } from '@core/test/mocks/form-option.mock'

describe('Test RetrieveTransactionsUseCase', () => {
  let gateway: TransactionApiGateway
  let repo: TransactionRepository
  let useCase: RetrieveTransactionsUseCase

  const searchParams = {
    page: 1,
    search: 'Groceries',
    ordering: '-transactionAt',
    filterModel: '',
  }

  const optionsData = createMockTransactionFormOption()
  const transactionData = {
    transactionId: 41,
    transactionForm: createMockTransactionForm({
      name: 'Groceries',
      store: optionsData.stores[0].name,
      place: optionsData.places[0].name,
      category: optionsData.categories[0].name,
      transactionType: optionsData.transactionTypes[0].id,
      tags: [optionsData.tags[0].name],
    }),
  }

  beforeEach(() => {
    gateway = new TransactionApiGateway()
    repo = new TransactionRepository()
    useCase = new RetrieveTransactionsUseCase(gateway, repo)

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

    await useCase.execute(searchParams)
    const state = store.getState().transactionState
    const currentTransaction = state.transactions.find((item) => item.id === 41)

    expect(state.transactions.length).toBe(1)
    expect(currentTransaction?.id).toBe(41)
    expect(currentTransaction?.name).toBe(transactionData.transactionForm.name)
    expect(currentTransaction?.amount).toBe(transactionData.transactionForm.amount)
    expect(currentTransaction?.store?.name).toBe(transactionData.transactionForm.store)
    expect(currentTransaction?.place?.name).toBe(transactionData.transactionForm.place)
    expect(currentTransaction?.category?.name).toBe(transactionData.transactionForm.category)
    expect(currentTransaction?.tags?.[0].name).toBe(transactionData.transactionForm.tags?.[0])
    expect(currentTransaction?.transactionType?.id).toBe(transactionData.transactionForm.transactionType)
    expect(state.searchParams.search).toBe(searchParams.search)
    expect(state.searchParams.ordering).toBe(searchParams.ordering)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(searchParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(searchParams)).rejects.toThrow('bad-request')
    expect(store.getState().transactionState.transactions).toEqual([])
  })
})
