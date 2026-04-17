import { mockAPIResponses } from "@data/infra/api-mock"
import UserCategoryApiGateway from "@data/gateways/api/services/category.gateway"
import UserCategoryRepository from "@data/gateways/api/services/category.repository"
import RetrieveUserCategoriesUseCase from "./retrieve-user-categories.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { store } from "@interface/presenters/store/store"
import { retrieveUserCategories } from "@base/core/interface/presenters/store/reducers/categories.reducer"

describe("Test RetrieveUserCategoriesUseCase", () => {
  let gateway: UserCategoryApiGateway
  let repo: UserCategoryRepository
  let useCase: RetrieveUserCategoriesUseCase

  beforeEach(() => {
    gateway = new UserCategoryApiGateway()
    repo = new UserCategoryRepository()
    useCase = new RetrieveUserCategoriesUseCase(gateway, repo)
    store.dispatch(retrieveUserCategories([]))
  })

  test("Execute without errors", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false)
    await useCase.execute()

    const state = store.getState().categoryState.userCategories

    expect(state).toHaveLength(2)
    expect(state[0].id).toBe(53)
    expect(state[0].name).toBe("Wactober")
    expect(state[0].transactionType?.name).toBe("Expenses")
    expect(state[1].id).toBe(46)
    expect(state[1].name).toBe("Mistletoe")
    expect(state[1].transactionType?.name).toBe("Expenses")
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "Failed" })

    await expect(useCase.execute()).rejects.toThrow(FormRequestError)
    await expect(useCase.execute()).rejects.toThrow("bad-request")
    expect(store.getState().categoryState.userCategories).toEqual([])
  })
})
