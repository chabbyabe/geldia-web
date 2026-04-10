import { mockAPIResponses } from '@data/infra/api-mock'
import CategoryApiGateway from '@data/gateways/api/services/category.gateway'
import CategoryRepository from '@data/gateways/api/services/category.repository'
import GetCategoryUseCase from './get-category.usecase'
import { BadRequest } from '@data/infra/api.error'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentCategory,
  initializeCategories,
} from '@interface/presenters/store/reducers/categories.reducer'

describe('Test GetCategoryUseCase', () => {
  let gateway: CategoryApiGateway
  let repo: CategoryRepository
  let useCase: GetCategoryUseCase

  beforeEach(() => {
    gateway = new CategoryApiGateway()
    repo = new CategoryRepository()
    useCase = new GetCategoryUseCase(gateway, repo)

    store.dispatch(
      initializeCategories({
        categories: {
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
    store.dispatch(clearCurrentCategory())
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await useCase.execute(52)

    const current = store.getState().categoryState.currentCategory
    expect(current?.id).toBe(52)
    expect(current?.name).toBe('New Category')
    expect(current?.transactionType?.name).toBe('Expenses')
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(52)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(52)).rejects.toThrow('bad-request')
    expect(store.getState().categoryState.currentCategory).toBeNull()
  })
})
