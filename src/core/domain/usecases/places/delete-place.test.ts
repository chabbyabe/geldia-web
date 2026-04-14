import { mockAPIResponses } from "@data/infra/api-mock"
import PlaceApiGateway from "@data/gateways/api/services/place.gateway"
import PlaceRepository from "@data/gateways/api/services/place.repository"
import DeletePlaceUseCase from "./delete-place.usecase"
import GetPlaceUseCase from "./get-place.usecase"
import RetrievePlacesUseCase from "./retrieve-places.usecase"
import { BadRequest } from "@data/infra/api.error"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentPlace,
  initializePlaces,
} from "@interface/presenters/store/reducers/places.reducer"

describe("Test DeletePlaceUseCase", () => {
  let gateway: PlaceApiGateway
  let repo: PlaceRepository
  let useCase: DeletePlaceUseCase

  const searchParams = {
    page: 1,
    search: "",
    ordering: "",
    filterModel: "",
  }

  beforeEach(() => {
    gateway = new PlaceApiGateway()
    repo = new PlaceRepository()
    useCase = new DeletePlaceUseCase(gateway, repo)

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
        searchParams,
      }),
    )
    store.dispatch(clearCurrentPlace())
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await new RetrievePlacesUseCase(gateway, repo).execute(searchParams)
    await new GetPlaceUseCase(gateway, repo).execute(63)

    const current = store.getState().placesState.currentPlace
    expect(current?.id).toBe(63)

    await useCase.execute(63)

    const deleted = store.getState().placesState.places.find((item) => item.id === 63)
    expect(deleted).toBeUndefined()
    expect(store.getState().placesState.currentPlace).toBeNull()
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(63)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(63)).rejects.toThrow("bad-request")
  })
})
