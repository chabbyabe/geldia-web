import { mockAPIResponses } from "@data/infra/api-mock"
import StoreApiGateway from "@data/gateways/api/services/store.gateway"
import StoreRepository from "@data/gateways/api/services/store.repository"
import UpdateStoreUseCase from "./update-store.usecase"
import RetrieveStoresUseCase from "./retrieve-stores.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentStore,
  initializeStores,
} from "@interface/presenters/store/reducers/stores.reducer"

describe("Test UpdateStoreUseCase", () => {
  let gateway: StoreApiGateway
  let repo: StoreRepository
  let useCase: UpdateStoreUseCase

  const form: IFormStore = {
    name: "Updated Store",
    classification: null,
  }

  const searchParams = {
    page: 1,
    search: "",
    ordering: "",
    filterModel: "",
  }

  beforeEach(() => {
    gateway = new StoreApiGateway()
    repo = new StoreRepository()
    useCase = new UpdateStoreUseCase(gateway, repo)

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
    await useCase.execute(63, form)

    const updated = store.getState().storesState.stores.find((item) => item.id === 63)
    expect(updated?.id).toBe(63)
    expect(updated?.name).toBe("Albert Heijn")
    expect(store.getState().storesState.currentStore?.id).toBe(63)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(63, form)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(63, form)).rejects.toThrow("bad-request")
  })
})
