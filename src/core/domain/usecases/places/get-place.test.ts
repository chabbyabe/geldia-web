import { mockAPIResponses } from "@data/infra/api-mock"
import PlaceApiGateway from "@data/gateways/api/services/place.gateway"
import PlaceRepository from "@data/gateways/api/services/place.repository"
import GetPlaceUseCase from "./get-place.usecase"
import { BadRequest } from "@data/infra/api.error"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentPlace,
  initializePlaces,
} from "@interface/presenters/store/reducers/places.reducer"

describe("Test GetPlaceUseCase", () => {
  let gateway: PlaceApiGateway
  let repo: PlaceRepository
  let useCase: GetPlaceUseCase

  beforeEach(() => {
    gateway = new PlaceApiGateway()
    repo = new PlaceRepository()
    useCase = new GetPlaceUseCase(gateway, repo)

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

    await useCase.execute(52)

    const current = store.getState().placesState.currentPlace
    expect(current?.id).toBe(52)
    expect(current?.name).toBe("Rotterdam")
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(52)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(52)).rejects.toThrow("bad-request")
    expect(store.getState().placesState.currentPlace).toBeNull()
  })
})
