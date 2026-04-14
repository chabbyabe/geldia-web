import { mockAPIResponses } from "@data/infra/api-mock"
import StoreApiGateway from "@data/gateways/api/services/store.gateway"
import StoreRepository from "@data/gateways/api/services/store.repository"
import DeleteStoreUseCase from "./delete-store.usecase"
import GetStoreUseCase from "./get-store.usecase"
import RetrieveStoresUseCase from "./retrieve-stores.usecase"
import { BadRequest } from "@data/infra/api.error"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentStore,
  initializeStores,
} from "@interface/presenters/store/reducers/stores.reducer"

describe("Test DeleteStoreUseCase", () => {
  let gateway: StoreApiGateway
  let repo: StoreRepository
  let useCase: DeleteStoreUseCase

  const searchParams = {
    page: 1,
    search: "",
    ordering: "",
    filterModel: "",
  }

  beforeEach(() => {
    gateway = new StoreApiGateway()
    repo = new StoreRepository()
    useCase = new DeleteStoreUseCase(gateway, repo)

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
        searchParams,
      }),
    )
    store.dispatch(clearCurrentStore())
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await new RetrieveStoresUseCase(gateway, repo).execute(searchParams)
    await new GetStoreUseCase(gateway, repo).execute(63)

    const current = store.getState().storesState.currentStore
    expect(current?.id).toBe(63)

    await useCase.execute(63)

    const deleted = store.getState().storesState.stores.find((item) => item.id === 63)
    expect(deleted).toBeUndefined()
    expect(store.getState().storesState.currentStore).toBeNull()
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(63)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(63)).rejects.toThrow("bad-request")
  })
})
