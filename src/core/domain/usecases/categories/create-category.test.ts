import { mockAPIResponses } from '@data/infra/api-mock'
import CategoryApiGateway from '@data/gateways/api/services/category.gateway'
import CategoryRepository from '@data/gateways/api/services/category.repository'
import CreateCategoryUseCase from './create-category.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentCategory,
  initializeCategories,
} from '@interface/presenters/store/reducers/categories.reducer'
import { IFormCategory } from '@domain/entities/formModels/category-form.entity'

describe('Test CreateCategoryUseCase', () => {
  let gateway: CategoryApiGateway
  let repo: CategoryRepository
  let useCase: CreateCategoryUseCase

  const categoryForm: IFormCategory = {
    name: 'New Category',
    notes: null,
    color: null,
    icon: null,
    transactionType: 2,
    parentCategory: null,
  }

  beforeEach(() => {
    gateway = new CategoryApiGateway()
    repo = new CategoryRepository()
    useCase = new CreateCategoryUseCase(gateway, repo)

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

    await useCase.execute(categoryForm)

    const category = store.getState().categoryState.categories.find((item) => item.id === 73)
    expect(category?.id).toBe(73)
    expect(category?.name).toBe('New Category')
    expect(category?.transactionType?.name).toBe('Expenses')
    expect(store.getState().categoryState.currentCategory?.id).toBe(73)
  })

  test('Execute with error', async () => {
    const simulatedError = 'failed'
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(categoryForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(categoryForm)).rejects.toThrow('bad-request')
    expect(store.getState().categoryState.categories).toEqual([])
    expect(store.getState().categoryState.currentCategory).toBeNull()
  })
})
