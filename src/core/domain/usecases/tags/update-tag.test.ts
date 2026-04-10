import { mockAPIResponses } from "@data/infra/api-mock"
import TagApiGateway from "@data/gateways/api/services/tag.gateway"
import TagRepository from "@data/gateways/api/services/tag.repository"
import UpdateTagUseCase from "./update-tag.usecase"
import RetrieveTagsUseCase from "./retrieve-tags.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentTag,
  initializeTags,
} from "@interface/presenters/store/reducers/tags.reducer"

describe("Test UpdateTagUseCase", () => {
  let gateway: TagApiGateway
  let repo: TagRepository
  let useCase: UpdateTagUseCase

  const tagForm: IFormTag = {
    name: "Updated Tag",
    color: "#006CD1",
  }

  const searchParams = {
    page: 1,
    search: "",
    ordering: "",
    filterModel: "",
  }

  beforeEach(() => {
    gateway = new TagApiGateway()
    repo = new TagRepository()
    useCase = new UpdateTagUseCase(gateway, repo)

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
    await useCase.execute(63, tagForm)

    const updated = store.getState().tagState.tags.find((item) => item.id === 63)
    expect(updated?.id).toBe(63)
    expect(updated?.name).toBe("Daily")
    expect(updated?.color).toBe("#006CD1")
    expect(store.getState().tagState.currentTag?.id).toBe(63)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(63, tagForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(63, tagForm)).rejects.toThrow("bad-request")
  })
})
