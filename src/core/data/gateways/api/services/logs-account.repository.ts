import { IPagedAccountLogEntity } from "@domain/entities/log/paged-account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { initializeAccountLogs } from "@interface/presenters/store/reducers/logs.reducer"
import { store } from "@interface/presenters/store/store"

export default class LogsAccountRepository {
  initializeLogs(logs: IPagedAccountLogEntity, searchParams: ILogSearchParams) {
    store.dispatch(initializeAccountLogs({ logs, searchParams }))
  }
}
