import { IPagedTransactionLogEntity } from "@domain/entities/log/paged-transaction-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { initializeLogs } from "@interface/presenters/store/reducers/logs.reducer"
import { store } from "@interface/presenters/store/store"

export default class LogsTransactionRepository {
  initializeLogs(logs: IPagedTransactionLogEntity, searchParams: ILogSearchParams) {
    store.dispatch(initializeLogs({ logs, searchParams }))
  }
}
