import { mockAPIResponses } from '@data/infra/api-mock'
import TransactionApiGateway from '@data/gateways/api/services/transaction.gateway'
import TransactionRepository from '@data/gateways/api/services/transaction.repository'
import UpdateTransactionUseCase from './update-transactions.usecase'
import RetrieveTransactionsUseCase from './retrieve-transactions.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentTransaction,
  initializeTransactions,
  retrieveFormInitialData,
} from '@interface/presenters/store/reducers/transactions.reducer'
import { createMockTransactionForm } from '@base/core/test/mocks/transaction.mock'
import { createMockTransactionFormOption } from '@base/core/test/mocks/form-option.mock'

describe('Test UpdateTransactionUseCase', () => {
  let gateway: TransactionApiGateway
  let repo: TransactionRepository
  let useCase: UpdateTransactionUseCase

  const optionsData = createMockTransactionFormOption()
  const originalTransactionData = {
    transactionId: 61,
    transactionForm: createMockTransactionForm({
      name: 'Salary',
      amount: 1000,
      netAmount: 1000,
      grossAmount: 1000,
      category: optionsData.categories[0].name,
      transactionType: optionsData.transactionTypes[0].id,
      tags: [optionsData.tags[0].name],
    }),
  }
  const updatedTransactionData = {
    transactionId: 61,
    transactionForm: createMockTransactionForm({
      name: 'Updated Salary',
      amount: 1200,
      netAmount: 1200,
      grossAmount: 1200,
      category: optionsData.categories[0].name,
      transactionType: optionsData.transactionTypes[0].id,
      tags: [optionsData.tags[0].name, 'Work'],
      notes: 'Updated monthly salary',
    }),
  }

  beforeEach(() => {
    gateway = new TransactionApiGateway()
    repo = new TransactionRepository()
    useCase = new UpdateTransactionUseCase(gateway, repo)

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
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, originalTransactionData)

    await new RetrieveTransactionsUseCase(gateway, repo).execute({
      page: 1,
      search: '',
      ordering: '',
      filterModel: '',
    })

    mockAPIResponses(gateway.apiSauce.axiosInstance, false, updatedTransactionData)

    await useCase.execute(61, updatedTransactionData.transactionForm)

    const state = store.getState().transactionState
    const updated = state.transactions.find((item) => item.id === 61)
    expect(updated?.name).toBe(updatedTransactionData.transactionForm.name)
    expect(updated?.amount).toBe(updatedTransactionData.transactionForm.amount)
    expect(updated?.tags?.length).toBe(2)
    expect(state.currentTransaction?.id).toBe(61)
    expect(state.currentTransaction?.name).toBe(updatedTransactionData.transactionForm.name)
    expect(state.currentTransaction?.amount).toBe(updatedTransactionData.transactionForm.amount)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, originalTransactionData)

    await new RetrieveTransactionsUseCase(gateway, repo).execute({
      page: 1,
      search: '',
      ordering: '',
      filterModel: '',
    })

    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(61, updatedTransactionData.transactionForm)).rejects.toThrow(
      FormRequestError,
    )
    await expect(useCase.execute(61, updatedTransactionData.transactionForm)).rejects.toThrow(
      'bad-request',
    )

    const state = store.getState().transactionState
    expect(state.transactions.find((item) => item.id === 61)?.name).toBe(
      originalTransactionData.transactionForm.name,
    )
    expect(state.currentTransaction).toBeNull()
  })
})
