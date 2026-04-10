import { mockAPIResponses } from '@data/infra/api-mock'
import CategoryApiGateway from '@data/gateways/api/services/category.gateway'
import CategoryRepository from '@data/gateways/api/services/category.repository'
import UpdateCategoryUseCase from './update-category.usecase'
import RetrieveCategoriesUseCase from './retrieve-categories.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentCategory,
  initializeCategories,
} from '@interface/presenters/store/reducers/categories.reducer'
import { IFormCategory } from '@domain/entities/formModels/category-form.entity'

describe('Test UpdateCategoryUseCase', () => {
  let gateway: CategoryApiGateway
  let repo: CategoryRepository
  let useCase: UpdateCategoryUseCase

  const categoryForm: IFormCategory = {
    name: 'Updated Category',
    notes: null,
    color: null,
    icon: null,
    transactionType: 2,
    parentCategory: null,
  }

  const searchParams = {
    page: 1,
    search: '',
    ordering: '',
    filterModel: '',
  }

  beforeEach(() => {
    gateway = new CategoryApiGateway()
    repo = new CategoryRepository()
    useCase = new UpdateCategoryUseCase(gateway, repo)

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
    await useCase.execute(63, categoryForm)

    const updated = store.getState().categoryState.categories.find((item) => item.id === 63)
    expect(updated?.id).toBe(63)
    expect(updated?.name).toBe('Abe Category')
    expect(updated?.transactionType?.name).toBe('Expenses')
    expect(store.getState().categoryState.currentCategory?.id).toBe(63)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(63, categoryForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(63, categoryForm)).rejects.toThrow('bad-request')
  })
})
