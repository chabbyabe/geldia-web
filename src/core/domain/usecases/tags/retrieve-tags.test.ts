import { mockAPIResponses } from "@data/infra/api-mock"
import TagApiGateway from "@data/gateways/api/services/tag.gateway"
import TagRepository from "@data/gateways/api/services/tag.repository"
import RetrieveTagsUseCase from "./retrieve-tags.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { store } from "@interface/presenters/store/store"
import { initializeTags } from "@interface/presenters/store/reducers/tags.reducer"

describe("Test RetrieveTagsUseCase", () => {
  let gateway: TagApiGateway
  let repo: TagRepository
  let useCase: RetrieveTagsUseCase

  const searchParams = {
    page: 1,
    search: "Daily",
    ordering: "-createdAt",
    filterModel: ""
  }

  beforeEach(() => {
    gateway = new TagApiGateway()
    repo = new TagRepository()
    useCase = new RetrieveTagsUseCase(gateway, repo)

    store.dispatch(
      initializeTags({
        tags: {
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

    const state = store.getState().tagState
    expect(state.tags.length).toBe(2)
    expect(state.tags[0].id).toBe(63)
    expect(state.tags[0].name).toBe("Daily")
    expect(state.tags[1].name).toBe("Work")
    expect(state.pagination.count).toBe(2)
    expect(state.searchParams.search).toBe(searchParams.search)
    expect(state.searchParams.ordering).toBe(searchParams.ordering)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(searchParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(searchParams)).rejects.toThrow("bad-request")
    expect(store.getState().tagState.tags).toEqual([])
  })
})
