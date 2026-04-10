import { mockAPIResponses } from '@data/infra/api-mock'
import CategoryApiGateway from '@data/gateways/api/services/category.gateway'
import CategoryRepository from '@data/gateways/api/services/category.repository'
import DeleteCategoryUseCase from './delete-category.usecase'
import GetCategoryUseCase from './get-category.usecase'
import RetrieveCategoriesUseCase from './retrieve-categories.usecase'
import { BadRequest } from '@data/infra/api.error'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentCategory,
  initializeCategories,
} from '@interface/presenters/store/reducers/categories.reducer'

describe('Test DeleteCategoryUseCase', () => {
  let gateway: CategoryApiGateway
  let repo: CategoryRepository
  let useCase: DeleteCategoryUseCase

  const searchParams = {
    page: 1,
    search: '',
    ordering: '',
    filterModel: '',
  }

  beforeEach(() => {
    gateway = new CategoryApiGateway()
    repo = new CategoryRepository()
    useCase = new DeleteCategoryUseCase(gateway, repo)

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
        searchParams,
      }),
    )
    store.dispatch(clearCurrentCategory())
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await new RetrieveCategoriesUseCase(gateway, repo).execute(searchParams)
    await new GetCategoryUseCase(gateway, repo).execute(63)

    const category = store.getState().categoryState.currentCategory
    expect(category?.id).toBe(63)

    await useCase.execute(63)

    const deleted = store.getState().categoryState.categories.find((item) => item.id === 63)
    expect(deleted).toBeUndefined()
    expect(store.getState().categoryState.currentCategory).toBeNull()
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(63)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(63)).rejects.toThrow('bad-request')
  })
})
