import { mockAPIResponses } from "@data/infra/api-mock"
import PlaceApiGateway from "@data/gateways/api/services/place.gateway"
import PlaceRepository from "@data/gateways/api/services/place.repository"
import RetrievePlacesUseCase from "./retrieve-places.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { store } from "@interface/presenters/store/store"
import { initializePlaces } from "@interface/presenters/store/reducers/places.reducer"

describe("Test RetrievePlacesUseCase", () => {
  let gateway: PlaceApiGateway
  let repo: PlaceRepository
  let useCase: RetrievePlacesUseCase

  const searchParams = {
    page: 1,
    search: "Amsterdam",
    ordering: "-createdAt",
    filterModel: ""
  }

  beforeEach(() => {
    gateway = new PlaceApiGateway()
    repo = new PlaceRepository()
    useCase = new RetrievePlacesUseCase(gateway, repo)

    store.dispatch(
      initializePlaces({
        places: {
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

    const state = store.getState().placesState
    expect(state.places.length).toBe(2)
    expect(state.places[0].id).toBe(63)
    expect(state.places[0].name).toBe("Amsterdam")
    expect(state.places[1].name).toBe("Rotterdam")
    expect(state.pagination.count).toBe(2)
    expect(state.searchParams.search).toBe(searchParams.search)
    expect(state.searchParams.ordering).toBe(searchParams.ordering)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(searchParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(searchParams)).rejects.toThrow("bad-request")
    expect(store.getState().placesState.places).toEqual([])
  })
})
