import { mockAPIResponses } from "@data/infra/api-mock"
import PlaceApiGateway from "@data/gateways/api/services/place.gateway"
import PlaceRepository from "@data/gateways/api/services/place.repository"
import UpdatePlaceUseCase from "./update-place.usecase"
import RetrievePlacesUseCase from "./retrieve-places.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentPlace,
  initializePlaces,
} from "@interface/presenters/store/reducers/places.reducer"

describe("Test UpdatePlaceUseCase", () => {
  let gateway: PlaceApiGateway
  let repo: PlaceRepository
  let useCase: UpdatePlaceUseCase

  const form: IFormPlace = {
    name: "Updated Place",
    classification: null,
  }

  const searchParams = {
    page: 1,
    search: "",
    ordering: "",
    filterModel: "",
  }

  beforeEach(() => {
    gateway = new PlaceApiGateway()
    repo = new PlaceRepository()
    useCase = new UpdatePlaceUseCase(gateway, repo)

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
    await useCase.execute(63, form)

    const updated = store.getState().placesState.places.find((item) => item.id === 63)
    expect(updated?.id).toBe(63)
    expect(updated?.name).toBe("Amsterdam")
    expect(store.getState().placesState.currentPlace?.id).toBe(63)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(63, form)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(63, form)).rejects.toThrow("bad-request")
  })
})
