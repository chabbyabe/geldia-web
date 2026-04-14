import { mockAPIResponses } from "@data/infra/api-mock"
import StoreApiGateway from "@data/gateways/api/services/store.gateway"
import StoreRepository from "@data/gateways/api/services/store.repository"
import RetrieveStoresUseCase from "./retrieve-stores.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { store } from "@interface/presenters/store/store"
import { initializeStores } from "@interface/presenters/store/reducers/stores.reducer"

describe("Test RetrieveStoresUseCase", () => {
  let gateway: StoreApiGateway
  let repo: StoreRepository
  let useCase: RetrieveStoresUseCase

  const searchParams = {
    page: 1,
    search: "Albert",
    ordering: "-createdAt",
    filterModel: ""
  }

  beforeEach(() => {
    gateway = new StoreApiGateway()
    repo = new StoreRepository()
    useCase = new RetrieveStoresUseCase(gateway, repo)

    store.dispatch(
      initializeStores({
        stores: {
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

    const state = store.getState().storesState
    expect(state.stores.length).toBe(2)
    expect(state.stores[0].id).toBe(63)
    expect(state.stores[0].name).toBe("Albert Heijn")
    expect(state.stores[1].name).toBe("Jumbo")
    expect(state.pagination.count).toBe(2)
    expect(state.searchParams.search).toBe(searchParams.search)
    expect(state.searchParams.ordering).toBe(searchParams.ordering)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(searchParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(searchParams)).rejects.toThrow("bad-request")
    expect(store.getState().storesState.stores).toEqual([])
  })
})
