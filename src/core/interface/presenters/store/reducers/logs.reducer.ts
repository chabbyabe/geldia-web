import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IPagedAccountLogEntity } from "@domain/entities/log/paged-account-log.entity"
import { IPagedTransactionLogEntity } from "@domain/entities/log/paged-transaction-log.entity"
import { IAccountLog } from "@domain/entities/log/account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { ITransactionLog } from "@domain/entities/log/transaction-log.entity"

interface ILogsState {
  logs: ITransactionLog[]
  accountLogs: IAccountLog[]
  nextLogsPage: string | null
  nextAccountLogsPage: string | null
  pagination: IBasePagedListEntity
  accountPagination: IBasePagedListEntity
  searchParams: ILogSearchParams
  accountSearchParams: ILogSearchParams
}

const initialState: ILogsState = {
  logs: [],
  accountLogs: [],
  nextLogsPage: null,
  nextAccountLogsPage: null,
  pagination: {
    count: 0,
    totalPages: 1,
    currentPageNumber: 1,
    next: null,
    previous: null
  },
  accountPagination: {
    count: 0,
    totalPages: 1,
    currentPageNumber: 1,
    next: null,
    previous: null
  },
  searchParams: {
    page: 1,
    search: "",
    ordering: "",
    filterModel: ""
  },
  accountSearchParams: {
    page: 1,
    search: "",
    ordering: "",
    filterModel: ""
  }
}

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    initializeLogs(state, action: PayloadAction<{
      logs: IPagedTransactionLogEntity
      searchParams: ILogSearchParams
    }>) {
      state.logs = [...action.payload.logs.results]
      state.nextLogsPage = action.payload.logs.next
      state.pagination = (({ results, ...rest }) => rest)(action.payload.logs)
      state.searchParams = {
        page: action.payload.logs.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    },
    initializeAccountLogs(state, action: PayloadAction<{
      logs: IPagedAccountLogEntity
      searchParams: ILogSearchParams
    }>) {
      state.accountLogs = [...action.payload.logs.results]
      state.nextAccountLogsPage = action.payload.logs.next
      state.accountPagination = (({ results, ...rest }) => rest)(action.payload.logs)
      state.accountSearchParams = {
        page: action.payload.logs.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    }
  }
})

export const { initializeLogs, initializeAccountLogs } = logsSlice.actions
export default logsSlice.reducer
