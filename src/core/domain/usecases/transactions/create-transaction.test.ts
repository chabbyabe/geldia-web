import { mockAPIResponses } from '@data/infra/api-mock'
import TransactionApiGateway from '@data/gateways/api/services/transaction.gateway'
import TransactionRepository from '@data/gateways/api/services/transaction.repository'
import CreateTransactionUseCase from './create-transaction.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentTransaction,
  initializeTransactions,
  retrieveFormInitialData,
} from '@interface/presenters/store/reducers/transactions.reducer'
import { createMockTransactionFormOption } from '@base/core/test/mocks/form-option.mock'
import { createMockTransactionForm } from '@base/core/test/mocks/transaction.mock'


describe('Test CreateTransactionUseCase', () => {
  let gateway: TransactionApiGateway
  let repo: TransactionRepository
  let useCase: CreateTransactionUseCase

  const optionsData = createMockTransactionFormOption()
  const transactionData = {
    transactionId: 31,
    transactionForm: createMockTransactionForm({
      name: 'Salary',
      amount: 1000,
      netAmount: 1000,
      grossAmount: 1000,
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
    useCase = new CreateTransactionUseCase(gateway, repo)

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

    await useCase.execute(transactionData.transactionForm)

    const transaction = store
      .getState()
      .transactionState.transactions.find((item) => item.id === 31)

    expect(transaction?.name).toBe(transactionData.transactionForm.name)
    expect(transaction?.amount).toBe(transactionData.transactionForm.amount)
    expect(transaction?.account?.id).toBe(transactionData.transactionForm.account)
    expect(transaction?.category?.name).toBe(transactionData.transactionForm.category)
    expect(transaction?.tags?.[0].name).toBe(transactionData.transactionForm.tags?.[0])
    expect(transaction?.transactionType?.id).toBe(
      transactionData.transactionForm.transactionType)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, 'failed')

    await expect(useCase.execute(transactionData.transactionForm)).rejects.toThrow(
      FormRequestError,
    )
    await expect(useCase.execute(transactionData.transactionForm)).rejects.toThrow(
      'bad-request',
    )
    expect(store.getState().transactionState.transactions).toEqual([])
  })
})
