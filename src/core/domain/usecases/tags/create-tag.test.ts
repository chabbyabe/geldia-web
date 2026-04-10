import { mockAPIResponses } from "@data/infra/api-mock"
import TagApiGateway from "@data/gateways/api/services/tag.gateway"
import TagRepository from "@data/gateways/api/services/tag.repository"
import CreateTagUseCase from "./create-tag.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { store } from "@interface/presenters/store/store"
import {
  clearCurrentTag,
  initializeTags,
} from "@interface/presenters/store/reducers/tags.reducer"

describe("Test CreateTagUseCase", () => {
  let gateway: TagApiGateway
  let repo: TagRepository
  let useCase: CreateTagUseCase

  const tagForm: IFormTag = {
    name: "Work",
    color: "#E5484D",
  }

  beforeEach(() => {
    gateway = new TagApiGateway()
    repo = new TagRepository()
    useCase = new CreateTagUseCase(gateway, repo)

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

    await useCase.execute(tagForm)

    const tag = store.getState().tagState.tags.find((item) => item.id === 73)
    expect(tag?.id).toBe(73)
    expect(tag?.name).toBe("Work")
    expect(tag?.color).toBe("#E5484D")
    expect(store.getState().tagState.currentTag?.id).toBe(73)
  })

  test("Execute with error", async () => {
    const simulatedError = "failed"
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(tagForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(tagForm)).rejects.toThrow("bad-request")
    expect(store.getState().tagState.tags).toEqual([])
    expect(store.getState().tagState.currentTag).toBeNull()
  })
})
