import { mockAPIResponses } from "@data/infra/api-mock"
import StoreApiGateway from "@data/gateways/api/services/store.gateway"
import StoreRepository from "@data/gateways/api/services/store.repository"
import GetStoreUseCase from "./get-store.usecase"
import { BadRequest } from "@data/infra/api.error"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentStore,
  initializeStores,
} from "@interface/presenters/store/reducers/stores.reducer"

describe("Test GetStoreUseCase", () => {
  let gateway: StoreApiGateway
  let repo: StoreRepository
  let useCase: GetStoreUseCase

  beforeEach(() => {
    gateway = new StoreApiGateway()
    repo = new StoreRepository()
    useCase = new GetStoreUseCase(gateway, repo)

    store.dispatch(
      initializeStores({
        stores: {
          results: [],
          next: null,
          previous: null,
          count: 0,
          totalPages: 1,
          currentPageNumber: 1,
        },
        searchParams: {
          page: 1,
          search: "",
          ordering: "",
          filterModel: "",
        },
      }),
    )
    store.dispatch(clearCurrentStore())
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await useCase.execute(52)

    const current = store.getState().storesState.currentStore
    expect(current?.id).toBe(52)
    expect(current?.name).toBe("Jumbo")
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(52)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(52)).rejects.toThrow("bad-request")
    expect(store.getState().storesState.currentStore).toBeNull()
  })
})
