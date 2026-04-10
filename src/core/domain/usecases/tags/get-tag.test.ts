import { mockAPIResponses } from "@data/infra/api-mock"
import TagApiGateway from "@data/gateways/api/services/tag.gateway"
import TagRepository from "@data/gateways/api/services/tag.repository"
import GetTagUseCase from "./get-tag.usecase"
import { BadRequest } from "@data/infra/api.error"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentTag,
  initializeTags,
} from "@interface/presenters/store/reducers/tags.reducer"

describe("Test GetTagUseCase", () => {
  let gateway: TagApiGateway
  let repo: TagRepository
  let useCase: GetTagUseCase

  beforeEach(() => {
    gateway = new TagApiGateway()
    repo = new TagRepository()
    useCase = new GetTagUseCase(gateway, repo)

    store.dispatch(
      initializeTags({
        tags: {
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
    store.dispatch(clearCurrentTag())
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await useCase.execute(52)

    const current = store.getState().tagState.currentTag
    expect(current?.id).toBe(52)
    expect(current?.name).toBe("Work")
    expect(current?.color).toBe("#E5484D")
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(52)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(52)).rejects.toThrow("bad-request")
    expect(store.getState().tagState.currentTag).toBeNull()
  })
})
