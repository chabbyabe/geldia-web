import { mockAPIResponses } from "@data/infra/api-mock"
import CategoryApiGateway from "@data/gateways/api/services/category.gateway"
import CategoryRepository from "@data/gateways/api/services/category.repository"
import RetrieveCategoriesUseCase from "./retrieve-categories.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { store } from "@interface/presenters/store/store"
import { initializeCategories } from "@interface/presenters/store/reducers/categories.reducer"

describe("Test RetrieveCategoriesUseCase", () => {
  let gateway: CategoryApiGateway
  let repo: CategoryRepository
  let useCase: RetrieveCategoriesUseCase

  const searchParams = {
    page: 1,
    search: "Abe",
    ordering: "-createdAt",
    filterModel: ""
  }

  beforeEach(() => {
    gateway = new CategoryApiGateway()
    repo = new CategoryRepository()
    useCase = new RetrieveCategoriesUseCase(gateway, repo)

    store.dispatch(
      initializeCategories({
        categories: {
          results: [],
          next: null,
          previous: null,
          count: 0,
          totalPages: 1,
          currentPageNumber: 1
        },
        searchParams: {
          page: 1,
          search: "",
          ordering: "",
          filterModel: ""
        }
      })
    )
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await useCase.execute(searchParams)

    const state = store.getState().categoryState
    expect(state.categories.length).toBe(2)
    expect(state.categories[0].id).toBe(63)
    expect(state.categories[0].name).toBe("Abe Category")
    expect(state.categories[0].transactionType?.name).toBe("Expenses")
    expect(state.categories[1].transactionType?.name).toBe("Transfer")
    expect(state.pagination.count).toBe(2)
    expect(state.searchParams.search).toBe(searchParams.search)
    expect(state.searchParams.ordering).toBe(searchParams.ordering)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(searchParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(searchParams)).rejects.toThrow("bad-request")
    expect(store.getState().categoryState.categories).toEqual([])
  })
})
