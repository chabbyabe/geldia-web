import { mockAPIResponses } from "@data/infra/api-mock"
import StoreApiGateway from "@data/gateways/api/services/store.gateway"
import StoreRepository from "@data/gateways/api/services/store.repository"
import CreateStoreUseCase from "./create-store.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentStore,
  initializeStores,
} from "@interface/presenters/store/reducers/stores.reducer"

describe("Test CreateStoreUseCase", () => {
  let gateway: StoreApiGateway
  let repo: StoreRepository
  let useCase: CreateStoreUseCase

  const form: IFormStore = {
    name: "Lidl",
    classification: null,
  }

  beforeEach(() => {
    gateway = new StoreApiGateway()
    repo = new StoreRepository()
    useCase = new CreateStoreUseCase(gateway, repo)

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

    await useCase.execute(form)

    const data = store.getState().storesState.stores.find((item) => item.id === 73)
    expect(data?.id).toBe(73)
    expect(data?.name).toBe("Jumbo")
    expect(store.getState().storesState.currentStore?.id).toBe(73)
  })

  test("Execute with error", async () => {
    const simulatedError = "failed"
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(form)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(form)).rejects.toThrow("bad-request")
    expect(store.getState().storesState.stores).toEqual([])
    expect(store.getState().storesState.currentStore).toBeNull()
  })
})
