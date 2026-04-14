import { mockAPIResponses } from "@data/infra/api-mock"
import PlaceApiGateway from "@data/gateways/api/services/place.gateway"
import PlaceRepository from "@data/gateways/api/services/place.repository"
import CreatePlaceUseCase from "./create-place.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentPlace,
  initializePlaces,
} from "@interface/presenters/store/reducers/places.reducer"

describe("Test CreatePlaceUseCase", () => {
  let gateway: PlaceApiGateway
  let repo: PlaceRepository
  let useCase: CreatePlaceUseCase

  const form: IFormPlace = {
    name: "Utrecht",
    classification: null,
  }

  beforeEach(() => {
    gateway = new PlaceApiGateway()
    repo = new PlaceRepository()
    useCase = new CreatePlaceUseCase(gateway, repo)

    store.dispatch(
      initializePlaces({
        places: {
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
    store.dispatch(clearCurrentPlace())
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await useCase.execute(form)

    const data = store.getState().placesState.places.find((item) => item.id === 73)
    expect(data?.id).toBe(73)
    expect(data?.name).toBe("Rotterdam")
    expect(store.getState().placesState.currentPlace?.id).toBe(73)
  })

  test("Execute with error", async () => {
    const simulatedError = "failed"
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(form)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(form)).rejects.toThrow("bad-request")
    expect(store.getState().placesState.places).toEqual([])
    expect(store.getState().placesState.currentPlace).toBeNull()
  })
})
