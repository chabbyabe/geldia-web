import { mockAPIResponses } from "@data/infra/api-mock"
import LogsTransactionApiGateway from "@data/gateways/api/services/logs-transaction.gateway"
import LogsTransactionRepository from "@data/gateways/api/services/logs-transaction.repository"
import RetrieveLogsTransactionUseCase from "./retrieve-logs-transaction.usecase"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { store } from "@interface/presenters/store/store"
import { initializeLogs } from "@interface/presenters/store/reducers/logs.reducer"

describe("Test RetrieveLogsTransactionUseCase", () => {
  let gateway: LogsTransactionApiGateway
  let repo: LogsTransactionRepository
  let useCase: RetrieveLogsTransactionUseCase

  const searchParams = {
    page: 1,
    search: "abe",
    ordering: "-createdAt",
    filterModel: ""
  }

  beforeEach(() => {
    gateway = new LogsTransactionApiGateway()
    repo = new LogsTransactionRepository()
    useCase = new RetrieveLogsTransactionUseCase(gateway, repo)

    store.dispatch(
      initializeLogs({
        logs: {
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

    const state = store.getState().logsState

    expect(state.logs.length).toBe(4)
    expect(state.logs[0].id).toBe(329)
    expect(state.logs[0].action).toBe("created")
    expect(state.logs[0].performedBy.username).toBe("abedeee")
    expect(state.logs[0].transaction?.id).toBe(307)
    expect(state.logs[0].transaction?.account?.name).toBe("ABE AND HOSEA")
    expect(state.logs[0].transaction?.grossAmount).toBe("2500.00")
    expect(state.logs[1].id).toBe(328)
    expect(state.logs[1].notes).toBe("Transaction date changed")
    expect(state.logs[1].transaction).toBeNull()
    expect(state.pagination.count).toBe(4)
    expect(state.pagination.currentPageNumber).toBe(1)
    expect(state.searchParams.search).toBe(searchParams.search)
    expect(state.searchParams.ordering).toBe(searchParams.ordering)
  })

  test("Execute with error", async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: "failed" })

    await expect(useCase.execute(searchParams)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(searchParams)).rejects.toThrow("bad-request")

    expect(store.getState().logsState.logs).toEqual([])
  })
})
