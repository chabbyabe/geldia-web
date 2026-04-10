import { mockAPIResponses } from "@data/infra/api-mock"
import TagApiGateway from "@data/gateways/api/services/tag.gateway"
import TagRepository from "@data/gateways/api/services/tag.repository"
import DeleteTagUseCase from "./delete-tag.usecase"
import GetTagUseCase from "./get-tag.usecase"
import RetrieveTagsUseCase from "./retrieve-tags.usecase"
import { BadRequest } from "@data/infra/api.error"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentTag,
  initializeTags,
} from "@interface/presenters/store/reducers/tags.reducer"

describe("Test DeleteTagUseCase", () => {
  let gateway: TagApiGateway
  let repo: TagRepository
  let useCase: DeleteTagUseCase

  const searchParams = {
    page: 1,
    search: "",
    ordering: "",
    filterModel: "",
  }

  beforeEach(() => {
    gateway = new TagApiGateway()
    repo = new TagRepository()
    useCase = new DeleteTagUseCase(gateway, repo)

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
        searchParams,
      }),
    )
    store.dispatch(clearCurrentTag())
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)

    await new RetrieveTagsUseCase(gateway, repo).execute(searchParams)
    await new GetTagUseCase(gateway, repo).execute(63)

    const tag = store.getState().tagState.currentTag
    expect(tag?.id).toBe(63)

    await useCase.execute(63)

    const deleted = store.getState().tagState.tags.find((item) => item.id === 63)
    expect(deleted).toBeUndefined()
    expect(store.getState().tagState.currentTag).toBeNull()
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(63)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(63)).rejects.toThrow("bad-request")
  })
})
