import { ITransaction } from "@domain/entities/transaction/transaction.entity"
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity"
import { retrieveSummaryOverview, retrieveRecentTransactions } from "@interface/presenters/store/reducers/dashboard.reducer"
import { store } from "@interface/presenters/store/store"

export default class DashboardRepository {
  retrieveSummaryOverview(summaries: ISummary[]) {
    store.dispatch(retrieveSummaryOverview(summaries))
  }
  retrieveRecentTransactions(transactions: ITransaction[]) {
    store.dispatch(retrieveRecentTransactions(transactions))
  }
}